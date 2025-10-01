#include "md_parser.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void print_usage(const char *prog_name) {
    printf("AI Chronicle Toolkit - md2json\n");
    printf("===============================\n\n");
    printf("Convert AI Chronicle markdown exports to structured JSON format.\n");
    printf("Works with conversations from Gemini, ChatGPT, Claude, and other platforms.\n\n");
    printf("Usage: %s <input.md> [output.json]\n\n", prog_name);
    printf("Arguments:\n");
    printf("  input.md      Path to the markdown conversation file\n");
    printf("  output.json   Optional output JSON file path\n");
    printf("                (default: replaces .md with .json)\n\n");
    printf("Examples:\n");
    printf("  %s conversation.md\n", prog_name);
    printf("  %s my-chat-2025-10-01.md output.json\n", prog_name);
    printf("  %s conversation.md > output.json\n\n", prog_name);
    printf("Part of AI Chronicle Toolkit\n");
    printf("https://github.com/quantum-encoding/ai-chronicle-toolkit\n");
    printf("\n");
}

// Generate output filename from input filename
static char* generate_output_filename(const char *input_file) {
    const char *dot = strrchr(input_file, '.');
    if (!dot || strcmp(dot, ".md") != 0) {
        // No .md extension, just append .json
        size_t len = strlen(input_file);
        char *output = malloc(len + 6); // +6 for ".json\0"
        if (output) {
            sprintf(output, "%s.json", input_file);
        }
        return output;
    }

    // Replace .md with .json
    size_t base_len = dot - input_file;
    char *output = malloc(base_len + 6); // +6 for ".json\0"
    if (output) {
        memcpy(output, input_file, base_len);
        strcpy(output + base_len, ".json");
    }
    return output;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        print_usage(argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        print_usage(argv[0]);
        return 0;
    }

    const char *input_file = argv[1];
    char *output_file = NULL;
    bool free_output = false;

    if (argc >= 3) {
        output_file = argv[2];
    } else {
        output_file = generate_output_filename(input_file);
        free_output = true;
        if (!output_file) {
            fprintf(stderr, "Error: Could not generate output filename\n");
            return 1;
        }
    }

    printf("AI Chronicle MD to JSON Converter\n");
    printf("==================================\n");
    printf("Input:  %s\n", input_file);
    printf("Output: %s\n\n", output_file);

    // Parse markdown file
    printf("Parsing markdown file...\n");
    MDConversation *conv = md_parse_file(input_file);
    if (!conv) {
        fprintf(stderr, "Error: Failed to parse markdown file\n");
        if (free_output) free(output_file);
        return 1;
    }

    printf("Parsed successfully!\n");
    printf("  Timestamp: %s\n", conv->metadata.timestamp ? conv->metadata.timestamp : "unknown");
    printf("  Total Blocks: %d\n", conv->metadata.total_blocks);
    printf("  Messages: %d\n", conv->metadata.messages);
    printf("  Thoughts: %d\n", conv->metadata.thoughts);
    printf("  Parsed Entries: %zu\n\n", conv->entry_count);

    // Convert to JSON and write
    printf("Converting to JSON...\n");
    if (!md_write_json_file(conv, output_file)) {
        fprintf(stderr, "Error: Failed to write JSON file\n");
        md_free_conversation(conv);
        if (free_output) free(output_file);
        return 1;
    }

    printf("Conversion complete!\n");
    printf("\nJSON file written to: %s\n", output_file);
    printf("\nYou can now query this file with aiquery:\n");
    printf("  ./aiquery \"search term\" %s\n", output_file);

    // Cleanup
    md_free_conversation(conv);
    if (free_output) free(output_file);

    return 0;
}
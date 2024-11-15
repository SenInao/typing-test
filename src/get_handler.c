#include "stdlib.h"
#include "string.h"
#include "../include/request_handler.h"
#include "../include/get_content.h"
#include "../include/server_err.h"
#include <stdio.h>

char* test_wordsCtrl() {
  char* fcontent = 0;
  long length;

  FILE *fp = fopen("sentences.txt", "r");

  if (fp == NULL) {
    return NULL;
  }

  fseek(fp, 0, SEEK_END);
  length = ftell(fp);
  fseek(fp, 0, SEEK_SET);
  fcontent = malloc(length);
  if (fcontent) {
    fread(fcontent, 1, length, fp);
  }
  fclose(fp);

  int sentenceIndex = rand() % 19 + 1;
  char* sentence = 0;

  int i;
  int newLineCount = 0;
  int sentenceStart = 0;
  for (i = 0; i < length; i++) {
    if (fcontent[i] == '\n') {
      newLineCount++;
      if (newLineCount == sentenceIndex) {
        int sentenceLen = i - sentenceStart;
        sentence = calloc(sentenceLen+1, sizeof(char));
        strncpy(sentence, &fcontent[sentenceStart], sentenceLen);
        break;
      }
      if (newLineCount == sentenceIndex-1) {
        sentenceStart = i+1;
      }
    }
  }

  char* content = malloc(strlen(sentence)+18);
  snprintf(content, strlen(sentence) + 18, "{ \"string\" : \"%s\" }", sentence);
  return content;
}

Response handle_get(Request request) {
  HTTP_HEADER** headers = malloc(sizeof(HTTP_HEADER*));
  int header_count = 0;

  char* body;
  char* status;
  char* message;
  int succsess = 0;

  if (strcmp(request.path, "/api/test-words") == 0) {
    body = test_wordsCtrl();
    add_header(&headers, &header_count, "content-type", "application/json");
    succsess = 1;
  } else {
    body = get_content(request.path);
    if (body != NULL) {
      succsess = 1;
    }
  }

  if (!succsess) {
    return not_found();
  } else {
    status = strdup("200");
    message = strdup("OK");
  }

  // Add standard headers
  char date_buf[32];
  time_t now = time(NULL);
  strftime(date_buf, sizeof(date_buf), "%a, %d %b %Y %H:%M:%S GMT", gmtime(&now));
  add_header(&headers, &header_count, "Date", date_buf);
  add_header(&headers, &header_count, "Server", "C-Custom-Server/1.0");

  char content_length[32];
  snprintf(content_length, sizeof(content_length), "%zu", strlen(body));
  add_header(&headers, &header_count, "Content-Length", content_length);

  Response response = build_res(request.version, status, message, headers, &header_count, body);
  return response;
}

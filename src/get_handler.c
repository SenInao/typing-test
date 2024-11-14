#include "stdlib.h"
#include "string.h"
#include "../include/request_handler.h"
#include "../include/get_content.h"
#include "../include/server_err.h"

char* test_wordsCtrl() {
  char* content = "Hei, mitt navn er sen og jeg elsker boller!";
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

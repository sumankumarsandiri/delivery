const response = (context) => {
  const response = {
    // settings: {
    success: context['success'],
    message: context['message'],
    status: context["status"],
    // },
    data: context['data'],
  };
  if ("page" in context) {
    // response.settings["page"] = context['page'];
    response["page"] = context['page'];
    delete context['page'];
  }
  // if ("next_page" in context) {
  //   // response.settings["next_page"] = context['next_page'];
  //   response["next_page"] = context['next_page'];
  //   delete context['next_page'];
  // }
  // if ("prev_page" in context) {
  //   // response.settings["prev_page"] = context['prev_page'];
  //   response["prev_page"] = context['prev_page'];
  //   delete context['prev_page'];
  // }
  // if ("total_pages" in context) {
  //   // response.settings["total_pages"] = context['total_pages'];
  //   response["total_pages"] = context['total_pages'];
  //   delete context['total_pages'];
  // }
  if ("limit" in context) {
    response["limit"] = context['limit'];
    delete context['limit'];
  }
  if ("count" in context) {
    // response.settings["count"] = context['count'];
    response["count"] = context['count'];
    delete context['count'];
  }
  return response;
};

module.exports = {
  response,
};
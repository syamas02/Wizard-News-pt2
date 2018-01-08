function vote(postId){
  const user = prompt("Who are you?");
  location.href = `/${user}/vote/${postId}`;
}
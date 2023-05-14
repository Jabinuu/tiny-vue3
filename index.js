const domName = document.getElementById("name");
const domJob = document.getElementById("job");

const person = reactive({
  name: "Mike",
  job: "student",
});

// 注册响应式的副作用函数，每当副作用函数中依赖的变量发生变化时，都会重新执行这个函数
effect(() => {
  domName.innerText = person.name;
  console.log(111);
});
effect(() => {
  domJob.innerText = person.job;
  console.log(222);
});

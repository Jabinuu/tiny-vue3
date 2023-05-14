const bucket = new WeakMap(); //副作用函数容器
const effectStack = [];
let activeEffct;

function track(target, key) {
  if (!activeEffct) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffct);
}

function trigger(target, key, newVal) {
  target[key] = newVal;
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  deps && deps.forEach((fn) => fn());
}

function reactive(data) {
  return new Proxy(data, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, newVal) {
      trigger(target, key, newVal);
      return true;
    },
  });
}

function effect(fn) {
  // 闭包的魅力，使得多次注册的副作用函数，执行某个副作用作用函数时，activeEffect动态更新指向自己
  const effectFn = () => {
    activeEffct = effectFn;
    effectStack.push(activeEffct);
    fn();
    effectStack.pop();
    activeEffct = effectStack[effectStack.length - 1];
  };
  effectFn();
  return effectFn;
}

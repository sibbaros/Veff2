//e)
//helloWorld.call(); works
//hello.call(); does not work 

function helloWorld() {
    console.log("Hello World");
}

helloWorld();
var hello = helloWorld();

helloWorld.call();

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function printArray() {
    for (i = 0; i < numbers.length; i++) {
        console.log(numbers[i]);
    }
}

function printArray2() {
    for (x in numbers) {
        console.log(numbers[x]);
    }
}

function printArray3() {
    numbers.forEach(function(item) {
        console.log(item);
    });
}
printArray();
printArray2();
printArray3();
var p = {
    name: "Sigurbjorg",
    age: 21
};

function Person(name, age) {
    this.name = name;
    this.age = age;
}

var p2 = new Person("Sigurbjorg", 21);
console.log(p2.name);
console.log(p2.age);
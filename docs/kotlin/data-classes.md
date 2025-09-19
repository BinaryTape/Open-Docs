[//]: # (title: 数据类)

Kotlin 中的数据类主要用于存储数据。对于每个数据类，编译器会自动生成额外的成员函数，使你能够将实例打印为可读输出、比较实例、复制实例等。
数据类用 `data` 标记：

```kotlin
data class User(val name: String, val age: Int)
```

编译器会自动从主构造函数中声明的所有属性派生出以下成员：

*   `equals()`/`hashCode()` 对。
*   `toString()` 函数，形式为 `"User(name=John, age=42)"`。
*   与属性声明顺序对应的 [`componentN()` 函数](destructuring-declarations.md)。
*   `copy()` 函数（详见下文）。

为了确保生成代码的一致性和有意义的行为，数据类必须满足以下要求：

*   主构造函数必须至少有一个形参。
*   所有主构造函数形参必须标记为 `val` 或 `var`。
*   数据类不能是 `abstract`、`open`、`sealed` 或 `inner`。

此外，数据类成员的生成遵循以下关于成员继承的规则：

*   如果数据类体中存在 `equals()`、`hashCode()` 或 `toString()` 的显式实现，或者在超类中存在 `final` 实现，则这些函数不会被生成，而是使用现有的实现。
*   如果超类型具有 `open` 且返回兼容类型的 `componentN()` 函数，则会为数据类生成对应的函数并覆盖超类型中的函数。如果超类型的函数因签名不兼容或因为是 `final` 而无法被覆盖，则会报告错误。
*   不允许为 `componentN()` 和 `copy()` 函数提供显式实现。

数据类可以扩展其他类（关于示例，请参见 [密封类](sealed-classes.md)）。

> 在 JVM 上，如果生成的类需要有一个无参构造函数，则必须为属性指定默认值（关于详情，请参见 [构造函数](classes.md#constructors)）：
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在类体中声明的属性

编译器仅使用主构造函数中定义的属性来自动生成函数。要将属性从生成的实现中排除，请在类体中声明它：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的示例中，`toString()`、`equals()`、`hashCode()` 和 `copy()` 实现默认只使用 `name` 属性，并且只有一个 component 函数，即 `component1()`。`age` 属性在类体中声明，因此被排除在外。
因此，两个具有相同 `name` 但 `age` 值不同的 `Person` 对象被视为相等，因为 `equals()` 仅求值主构造函数中的属性：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)
  
    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 复制

使用 `copy()` 函数可以复制对象，从而在保留其余属性不变的情况下更改其_部分_属性。
上面 `User` 类的此函数实现如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

然后你可以这样编写：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 函数会创建实例的_浅_复制。换句话说，它不会递归复制 component。结果是，对其他对象的引用是共享的。

例如，如果某个属性持有可变 list，则通过“原始”值进行的更改也通过复制可见，而通过复制进行的更改也通过原始值可见：

```kotlin
data class Employee(val name: String, val roles: MutableList<String>)

fun main() {
    val original = Employee("Jamie", mutableListOf("developer"))
    val duplicate = original.copy()

    duplicate.roles.add("team lead")

    println(original) 
    // Employee(name=Jamie, roles=[developer, team lead])
    println(duplicate) 
    // Employee(name=Jamie, roles=[developer, team lead])
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如你所见，修改 `duplicate.roles` 属性也会更改 `original.roles` 属性，因为这两个属性共享相同的 list 引用。

## 数据类与解构声明

为数据类生成的_component 函数_使其可以在 [解构声明](destructuring-declarations.md) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 标准数据类

标准库提供了 `Pair` 和 `Triple` 类。但在大多数情况下，命名数据类是更好的设计选择，因为它们通过为属性提供有意义的名称使代码更易于阅读。
`[//]: # (title: 数据类)`

Kotlin 中的数据类主要用于保存数据。对于每个数据类，编译器会自动生成额外的成员函数，使你能够将实例打印为可读输出、比较实例、复制实例等。
数据类使用 `data` 关键字标记：

```kotlin
data class User(val name: String, val age: Int)
```

编译器会自动从主构造函数中声明的所有属性派生出以下成员：

*   `equals()`/`hashCode()` 对。
*   `toString()` 函数，形式为 `"User(name=John, age=42)"`。
*   [`componentN()` 函数](destructuring-declarations.md)，对应于属性的声明顺序。
*   `copy()` 函数（见下文）。

为确保生成代码的一致性和有意义的行为，数据类必须满足以下要求：

*   主构造函数必须至少有一个参数。
*   所有主构造函数参数都必须标记为 `val` 或 `var`。
*   数据类不能是抽象的 (`abstract`)、开放的 (`open`)、密封的 (`sealed`) 或内部的 (`inner`)。

此外，数据类成员的生成遵循以下关于成员继承的规则：

*   如果在数据类体中存在 `equals()`、`hashCode()` 或 `toString()` 的显式实现，或者在超类中存在 `final` 实现，则不会生成这些函数，而是使用现有实现。
*   如果超类型具有 `open` 且返回兼容类型的 `componentN()` 函数，则会为数据类生成相应的函数并覆盖超类型中的函数。如果由于签名不兼容或函数为 `final` 而无法覆盖超类型中的函数，则会报告错误。
*   不允许为 `componentN()` 和 `copy()` 函数提供显式实现。

数据类可以扩展其他类（参见 [密封类](sealed-classes.md) 获取示例）。

> 在 JVM 上，如果生成的类需要一个无参数构造函数，则必须为属性指定默认值（参见 [构造函数](classes.md#constructors)）：
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在类体中声明的属性

编译器仅使用主构造函数中定义的属性来生成自动生成的函数。要将属性从生成的实现中排除，请将其声明在类体中：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的示例中，`toString()`、`equals()`、`hashCode()` 和 `copy()` 实现默认仅使用 `name` 属性，并且只有一个 `component1()` 组件函数。`age` 属性在类体中声明并被排除。因此，两个 `Person` 对象，即使 `age` 值不同，只要 `name` 相同，就被视为相等，因为 `equals()` 仅评估主构造函数中的属性：

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

使用 `copy()` 函数复制对象，它允许你更改其中**某些**属性，同时保持其余属性不变。
上面 `User` 类的此函数实现如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

你还可以这样写：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 数据类与解构声明

数据类生成的*组件函数*使得它们可以在 [解构声明](destructuring-declarations.md) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 标准数据类

标准库提供了 `Pair` 和 `Triple` 类。然而，在大多数情况下，命名数据类是更好的设计选择，因为它们通过为属性提供有意义的名称来使代码更易于阅读。
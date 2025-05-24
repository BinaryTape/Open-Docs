---
title: 数据类
---
Kotlin 中的 Data Class（数据类）主要用于保存数据。对于每个数据类，编译器会自动生成额外的成员函数，允许你将实例打印为可读的输出，比较实例，复制实例等等。
数据类用 `data` 标记：

```kotlin
data class User(val name: String, val age: Int)
```

编译器会自动从主构造函数中声明的所有属性派生以下成员：

* `equals()`/`hashCode()` 对。
* `toString()` 形式为 `"User(name=John, age=42)"`。
* 与属性声明顺序相对应的 [`componentN()` 函数](destructuring-declarations)。
* `copy()` 函数 (见下文)。

为了确保生成代码的一致性和有意义的行为，数据类必须满足以下要求：

* 主构造函数必须至少有一个参数。
* 所有主构造函数参数必须标记为 `val` 或 `var`。
* 数据类不能是 abstract（抽象的）、open（开放的）、sealed（密封的）或 inner（内部的）。

此外，数据类成员的生成遵循以下关于成员继承的规则：

* 如果在数据类主体中存在 `equals()`、`hashCode()` 或 `toString()` 的显式实现，或者在超类中存在 `final` 实现，则不会生成这些函数，并且会使用现有的实现。
* 如果超类型具有 `open` 并且返回兼容类型的 `componentN()` 函数，则会为数据类生成相应的函数并覆盖超类型的函数。 如果由于签名不兼容或由于它们是 final 而无法覆盖超类型的函数，则会报告错误。
* 不允许为 `componentN()` 和 `copy()` 函数提供显式实现。

数据类可以扩展其他类（有关示例，请参见 [Sealed classes（密封类）](sealed-classes)）。

:::note
在 JVM 上，如果生成的类需要具有无参数构造函数，则必须为属性指定默认值（请参阅 [Constructors（构造函数）](classes#constructors)）：

```kotlin
data class User(val name: String = "", val age: Int = 0)
```

:::

## Properties declared in the class body（类主体中声明的属性）

编译器仅使用主构造函数中定义的属性来自动生成函数。 要从生成的实现中排除属性，请在类主体中声明它：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的示例中，默认情况下，`toString()`、`equals()`、`hashCode()` 和 `copy()` 实现中仅使用 `name` 属性，并且只有一个 component 函数 `component1()`。 `age` 属性在类主体中声明，并被排除在外。
因此，具有相同 `name` 但不同 `age` 值的两个 `Person` 对象被认为是相等的，因为 `equals()` 仅评估主构造函数中的属性：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {

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

}
```

## Copying（复制）

使用 `copy()` 函数复制对象，允许你更改其_某些_属性，同时保持其余属性不变。
上面 `User` 类的此函数的实现如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

然后你可以编写以下内容：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## Data classes and destructuring declarations（数据类和解构声明）

为数据类生成的 _Component Functions（组件函数）_ 使它们可以在 [destructuring declarations（解构声明）](destructuring-declarations) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## Standard data classes（标准数据类）

标准库提供了 `Pair` 和 `Triple` 类。 但是，在大多数情况下，命名数据类是更好的设计选择，因为它们通过为属性提供有意义的名称使代码更易于阅读。
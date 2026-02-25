[//]: # (title: 数据类)

Kotlin 中的数据类主要用于持有数据。对于每个数据类，编译器都会自动生成额外的成员函数，允许你将实例打印到可读的输出、比较实例、复制实例等。数据类使用 `data` 标记：

```kotlin
data class User(val name: String, val age: Int)
```

编译器会自动根据主构造函数中声明的所有属性推导以下成员：

* `equals()`/`hashCode()` 对。
* 形式为 `"User(name=John, age=42)"` 的 `toString()`。
* 与属性声明顺序相对应的 [`componentN()` 函数](destructuring-declarations.md)。
* `copy()` 函数（见下文）。

为了确保生成代码的一致性和有意义的行为，数据类必须符合以下要求：

* 主构造函数必须至少有一个形参。
* 所有主构造函数形参必须标记为 `val` 或 `var`。
* 数据类不能是 `abstract`、`open`、`sealed` 或 `inner` 的。

此外，数据类成员的生成在成员继承方面遵循以下规则：

* 如果数据类类体中存在 `equals()`、`hashCode()` 或 `toString()` 的显式实现，或者基类中有 `final` 实现，则不会生成这些函数，而是使用现有的实现。
* 如果超类型具有 `open` 且返回兼容类型的 `componentN()` 函数，则会为数据类生成相应的函数并重写超类型中的函数。如果由于签名不兼容或由于其为 `final` 而无法重写超类型中的函数，则会报告错误。
* 不允许为 `componentN()` 和 `copy()` 函数提供显式实现。

数据类可以扩展其他类（示例请参阅[密封类](sealed-classes.md)）。

> 在 JVM 上，如果生成的类需要包含无参构造函数，则必须为属性指定默认值（参见[构造函数](classes.md#constructors-and-initializer-blocks)）：
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 类体中声明的属性

编译器仅将主构造函数内定义的属性用于自动生成的函数。要从生成的实现中排除某个属性，请将其声明在类体中：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的示例中，默认情况下只有 `name` 属性会被用于 `toString()`、`equals()`、`hashCode()` 和 `copy()` 的实现，并且只有一个 component 函数 `component1()`。`age` 属性声明在类体内部并被排除。因此，两个具有相同 `name` 但不同 `age` 值的 `Person` 对象被视为相等，因为 `equals()` 仅评估主构造函数中的属性：

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

使用 `copy()` 函数可以复制对象，允许你修改其中的*部分*属性，同时保持其余属性不变。上述 `User` 类的该函数实现如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

然后你可以编写如下代码：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 函数创建实例的*浅*拷贝。换句话说，它不会递归地复制组件。因此，对其他对象的引用是共享的。

例如，如果一个属性持有可变列表，则通过“原始”值所做的更改在副本中也是可见的，通过副本所做的更改在原始值中也是可见的：

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

如你所见，修改 `duplicate.roles` 属性也会更改 `original.roles` 属性，因为这两个属性共享同一个列表引用。

## 数据类与析构声明

为数据类生成的 *component 函数* 使其能够用于[析构声明](destructuring-declarations.md)：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 标准数据类

标准库提供了 `Pair` 和 `Triple` 类。但在大多数情况下，命名数据类是更好的设计选择，因为它们通过为属性提供有意义的名称使代码更易于阅读。
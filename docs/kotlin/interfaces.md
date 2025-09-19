[//]: # (title: 接口)

Kotlin 中的接口可以包含抽象方法的声明，以及方法的实现。它们与抽象类的不同之处在于，接口不能存储状态。它们可以有属性，但这些属性需要是抽象的，或者提供访问器实现。

接口使用 `interface` 关键字定义：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## 实现接口

一个类或对象可以实现一个或多个接口：

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## 接口中的属性

你可以在接口中声明属性。在接口中声明的属性可以是抽象的，也可以提供访问器的实现。在接口中声明的属性不能有幕后字段，因此在接口中声明的访问器不能引用它们：

```kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## 接口继承

一个接口可以从其他接口派生，这意味着它既可以为其成员提供实现，也可以声明新的函数和属性。很自然地，实现此类接口的类只需定义缺失的实现即可：

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // implementing 'name' is not required
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## 解决覆盖冲突

当你在超类型列表中声明了多个类型时，你可能会继承同一个方法的多个实现：

```kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```

接口 *A* 和 *B* 都声明了函数 *foo()* 和 *bar()*。它们都实现了 *foo()*，但只有 *B* 实现了 *bar()*（*bar()* 在 *A* 中没有被标记为抽象，因为如果函数没有方法体，这是接口的默认行为）。现在，如果你从 *A* 派生一个具体类 *C*，你必须覆盖 *bar()* 并提供一个实现。

然而，如果你从 *A* 和 *B* 派生 *D*，你需要实现你从多个接口继承的所有方法，并且你需要指定 *D* 应该如何精确地实现它们。这条规则既适用于你继承了单一实现的方法（*bar()*），也适用于你继承了多个实现的方法（*foo()*）。

## 针对接口函数的 JVM 默认方法生成

在 JVM 上，接口中声明的函数会被编译为默认方法。你可以使用 `-jvm-default` 编译器选项来控制此行为，其取值如下：

*   `enable` (默认值)：在接口中生成默认实现，并在子类和 `DefaultImpls` 类中包含桥接函数。使用此模式可以维护与旧版 Kotlin 的二进制兼容性。
*   `no-compatibility`：仅在接口中生成默认实现。此模式跳过兼容性桥接和 `DefaultImpls` 类，适用于新的 Kotlin 代码。
*   `disable`：跳过默认方法，仅生成兼容性桥接和 `DefaultImpls` 类。

要配置 `-jvm-default` 编译器选项，请在你的 Gradle Kotlin DSL 中设置 `jvmDefault` 属性：

```kotlin
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
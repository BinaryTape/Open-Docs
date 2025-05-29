[//]: # (title: 接口)

Kotlin 中的接口可以包含抽象方法的声明，以及方法的实现。它们与抽象类的不同之处在于，接口不能存储状态。它们可以拥有属性，但这些属性必须是抽象的或提供访问器实现。

使用 `interface` 关键字定义接口：

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

你可以在接口中声明属性。在接口中声明的属性可以是抽象的，也可以为访问器提供实现。在接口中声明的属性不能有幕后字段 (backing fields)，因此接口中声明的访问器不能引用它们：

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

一个接口可以派生自其他接口，这意味着它可以为它们的成员提供实现，并声明新的函数和属性。很自然地，实现此类接口的类只需定义缺失的实现：

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

## 解决重写冲突

当你在超类型列表中声明多个类型时，你可能会继承同一个方法的多个实现：

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

接口 *A* 和 *B* 都声明了函数 *foo()* 和 *bar()*。它们都实现了 *foo()*，但只有 *B* 实现了 *bar()*（*bar()* 在 *A* 中未被标记为抽象，因为如果函数没有函数体，这对于接口来说是默认行为）。现在，如果你从 *A* 派生一个具体类 *C*，你必须重写 *bar()* 并提供一个实现。

然而，如果你从 *A* 和 *B* 派生 *D*，你需要实现从多个接口继承的所有方法，并且你需要明确 *D* 应该如何实现它们。这条规则适用于你继承了单一实现的方法（*bar()*），以及你继承了多个实现的方法（*foo()*）。
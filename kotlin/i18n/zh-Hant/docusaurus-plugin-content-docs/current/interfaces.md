---
title: "介面 (Interfaces)"
---
Kotlin 中的介面 (Interface) 可以包含抽象方法 (abstract methods) 的宣告，以及方法實作 (method implementations)。介面與抽象類別 (abstract classes) 的不同之處在於，介面不能儲存狀態 (state)。它們可以擁有屬性 (properties)，但這些屬性需要是抽象的 (abstract) 或提供存取器實作 (accessor implementations)。

介面使用 `interface` 關鍵字定義：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## 實作介面 (Implementing interfaces)

一個類別 (class) 或物件 (object) 可以實作一個或多個介面：

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## 介面中的屬性 (Properties in interfaces)

您可以在介面中宣告屬性。在介面中宣告的屬性可以是抽象的，也可以提供存取器的實作。在介面中宣告的屬性不能有 backing fields （幕後欄位），因此在介面中宣告的存取器不能參考它們：

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

## 介面繼承 (Interfaces Inheritance)

一個介面可以繼承 (derive) 自其他介面，這表示它可以為它們的成員提供實作，並宣告新的函式和屬性。很自然地，實作此類介面的類別只需要定義缺少的實作：

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

## 解決覆寫衝突 (Resolving overriding conflicts)

當您在超類型 (supertype) 列表中宣告許多類型時，您可能會繼承同一個方法的多個實作：

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

介面 *A* 和 *B* 都宣告了函式 *foo()* 和 *bar()*。它們都實作了 *foo()*，但只有 *B* 實作了 *bar()*（如果函式沒有主體，則 *bar()* 在 *A* 中不會被標記為抽象的，因為這是介面的預設行為）。現在，如果您從 *A* 派生出一個具體類別 *C*，則必須覆寫 *bar()* 並提供一個實作。

但是，如果您從 *A* 和 *B* 派生出 *D*，則需要實作從多個介面繼承的所有方法，並且需要明確指定 *D* 應該如何實作它們。此規則適用於您已繼承單一實作的方法 (*bar()*)，以及您已繼承多個實作的方法 (*foo()*)。
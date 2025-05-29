[//]: # (title: 介面)

Kotlin 中的介面可以包含抽象方法的宣告，以及方法的實作。它們與抽象類別的不同之處在於，介面無法儲存狀態。它們可以擁有屬性，但這些屬性必須是抽象的或提供存取器實作。

介面使用關鍵字 `interface` 來定義：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## 實作介面

一個類別或物件可以實作一個或多個介面：

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## 介面中的屬性

您可以在介面中宣告屬性。在介面中宣告的屬性可以是抽象的，或為存取器提供實作。在介面中宣告的屬性不能有幕後欄位 (backing fields)，因此在介面中宣告的存取器無法參考它們：

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

## 介面繼承

一個介面可以衍生自其他介面，這意味著它既可以為其成員提供實作，也可以宣告新的函式和屬性。很自然地，實作此類介面的類別只需要定義缺失的實作：

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

## 解決覆寫衝突

當您在超類型清單中宣告多個類型時，您可能會繼承同一個方法的多個實作：

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

介面 *A* 和 *B* 都宣告了函式 *foo()* 和 *bar()*。它們都實作了 *foo()*，但只有 *B* 實作了 *bar()* (*bar()* 在 *A* 中未被標記為抽象，因為如果函式沒有主體，這是介面的預設行為)。現在，如果您從 *A* 衍生一個具體類別 *C*，您必須覆寫 *bar()* 並提供一個實作。

然而，如果您從 *A* 和 *B* 衍生 *D*，您需要實作所有從多個介面繼承而來的方法，並且您需要指定 *D* 應該如何精確地實作它們。這條規則既適用於您繼承了單一實作的方法 (*bar()*)，也適用於您繼承了多個實作的方法 (*foo()*).
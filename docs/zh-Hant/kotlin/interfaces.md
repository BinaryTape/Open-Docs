[//]: # (title: 介面)

Kotlin 中的介面可以包含抽象方法的宣告，以及方法的實作。它們與抽象類別的不同之處在於，介面無法儲存狀態。它們可以擁有屬性，但這些屬性必須是抽象的或提供存取器實作。

介面使用關鍵字 `interface` 定義：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 選用主體
    }
}
```

## 實作介面

類別或物件可以實作一或多個介面：

```kotlin
class Child : MyInterface {
    override fun bar() {
        // 主體
    }
}
```

## 介面中的屬性

您可以在介面中宣告屬性。在介面中宣告的屬性可以是抽象的，或提供存取器的實作。介面中宣告的屬性不能有後備欄位，因此在介面中宣告的存取器不能參考它們：

```kotlin
interface MyInterface {
    val prop: Int // 抽象

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

介面可以從其他介面衍生，這表示它既可以為其成員提供實作，也可以宣告新的函式和屬性。很自然地，實作這類介面的類別僅需定義遺漏的實作：

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
    // 不需實作 'name'
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## 解決覆寫衝突

當您在父型別清單中宣告多個型別時，您可能會繼承同一方法的多個實作：

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

介面 *A* 和 *B* 都宣告了函式 *foo()* 和 *bar()*。它們都實作了 *foo()*，但只有 *B* 實作了 *bar()*（*bar()* 在 *A* 中未標記為抽象，因為如果函式沒有主體，這就是介面的預設行為）。現在，如果您從 *A* 衍生一個具體類別 *C*，您必須覆寫 *bar()* 並提供一個實作。

然而，如果您從 *A* 和 *B* 衍生 *D*，您需要實作所有從多個介面繼承的方法，並且需要指定 *D* 應該如何精確地實作它們。此規則適用於您繼承了單一實作的方法（*bar()*），以及您繼承了多個實作的方法（*foo()*）。

## 介面函式的 JVM 預設方法生成

在 JVM 上，介面中宣告的函式會被編譯為預設方法。您可以使用 `-jvm-default` 編譯器選項和以下值來控制此行為：

*   `enable` (預設值)：在介面中生成預設實作，並在子類別和 `DefaultImpls` 類別中包含橋接函式。使用此模式可保持與舊版 Kotlin 的二進位相容性。
*   `no-compatibility`：僅在介面中生成預設實作。此模式會跳過相容性橋接和 `DefaultImpls` 類別，使其適用於新的 Kotlin 程式碼。
*   `disable`：跳過預設方法，並僅生成相容性橋接和 `DefaultImpls` 類別。

要配置 `-jvm-default` 編譯器選項，請在您的 Gradle Kotlin DSL 中設定 `jvmDefault` 屬性：

```kotlin
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```
---
title: "從 Kotlin 呼叫 Java"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 的設計以 Java 互通性（Java interoperability）為考量。現有的 Java 程式碼可以很自然地從 Kotlin 中呼叫，而 Kotlin 程式碼也可以相當順暢地在 Java 中使用。在本節中，我們將詳細介紹從 Kotlin 呼叫 Java 程式碼的一些細節。

幾乎所有的 Java 程式碼都可以毫無問題地使用：

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for' 迴圈適用於 Java 集合：
    for (item in source) {
        list.add(item)
    }
    // 運算符慣例也適用：
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get 和 set 會被呼叫
    }
}
```

## Getters 和 setters

遵循 Java 的 getters 和 setters 慣例的方法（以 `get` 開頭且沒有參數的方法，以及以 `set` 開頭且只有一個參數的方法）在 Kotlin 中會被表示為屬性（properties）。這些屬性也被稱為「合成屬性」（_synthetic properties_）。`Boolean` 存取器方法（getter 的名稱以 `is` 開頭，setter 的名稱以 `set` 開頭）會被表示為與 getter 方法同名的屬性。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // 呼叫 getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY // 呼叫 setFirstDayOfWeek()
    }
    if (!calendar.isLenient) { // 呼叫 isLenient()
        calendar.isLenient = true // 呼叫 setLenient()
    }
}
```

上面的 `calendar.firstDayOfWeek` 是一個合成屬性的例子。

請注意，如果 Java 類別只有 setter，則它在 Kotlin 中不會顯示為屬性，因為 Kotlin 不支援唯寫屬性（set-only properties）。

## Java 合成屬性參考

:::note
此功能為 [實驗性功能（Experimental）](components-stability#stability-levels-explained)。它可能隨時被刪除或更改。
我們建議您僅將其用於評估目的。

從 Kotlin 1.8.20 開始，您可以建立對 Java 合成屬性的參考。考慮以下 Java 程式碼：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin 始終允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您也可以建立對 `Person::age` 和 `person::age` 的參考。這同樣適用於 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // 呼叫 Java 合成屬性的參考：
        .sortedBy(Person::age)
         // 透過 Kotlin 屬性語法呼叫 Java getter：
        .forEach { person `->` println(person.name) }
```

### 如何啟用 Java 合成屬性參考

要啟用此功能，請設定 `-language-version 2.1` 編譯器選項。在 Gradle 項目中，您可以將以下內容新增到您的 `build.gradle(.kts)` 中：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
            )
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</TabItem>
</Tabs>

在 Kotlin 1.9.0 之前，要啟用此功能，您必須設定 `-language-version 1.9` 編譯器選項。

:::

## 返回 void 的方法

如果 Java 方法返回 `void`，則從 Kotlin 呼叫時，它將返回 `Unit`。如果有人碰巧使用了該返回值，Kotlin 編譯器將在呼叫站點（call site）賦予它，因為該值本身是事先已知的（即 `Unit`）。

## 轉義 Kotlin 關鍵字作為 Java 標識符

某些 Kotlin 關鍵字在 Java 中是有效的標識符：`in`、`object`、`is` 等。如果 Java 函式庫使用 Kotlin 關鍵字作為方法，您仍然可以呼叫該方法，並使用反引號（`）字元對其進行轉義：

```kotlin
foo.`is`(bar)
```

## 空值安全性和平台類型（Platform Types）

Java 中的任何引用都可能是 `null`，這使得 Kotlin 對於來自 Java 的物件的嚴格空值安全性要求不切實際。Java 聲明的類型在 Kotlin 中以特定方式處理，稱為「平台類型」（*platform types*）。對於這些類型，空值檢查（Null-checks）會被放寬，因此它們的安全保證與 Java 中相同（請參閱下面的更多資訊 [mapped-types](#mapped-types)）。

考慮以下範例：

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // 推斷的平台類型（普通的 Java 物件）
```

當您在平台類型的變數上呼叫方法時，Kotlin 不會在編譯時發出可空性錯誤（nullability errors），但由於空指標異常（null-pointer exception）或 Kotlin 產生的用於防止空值傳播的斷言，呼叫可能會在運行時失敗：

```kotlin
item.substring(1) // 允許，如果 item == null 則會拋出異常
```

平台類型是 *non-denotable*，這表示您無法在語言中顯式地寫下它們。當平台值被賦予給 Kotlin 變數時，您可以依賴類型推斷（然後該變數將具有推斷的平台類型，如上面範例中的 `item`），或者您可以選擇您期望的類型（允許可空和非可空類型）：

```kotlin
val nullable: String? = item // 允許，始終有效
val notNull: String = item // 允許，可能在運行時失敗
```

如果您選擇非可空類型，則編譯器將在賦值時發出斷言。這可以防止 Kotlin 的非可空變數持有空值。當您將平台值傳遞給期望非空值的 Kotlin 函數以及其他情況時，也會發出斷言。總體而言，編譯器會盡最大努力防止空值在程式中遠距離傳播，儘管由於泛型（generics）的原因，有時不可能完全消除這種情況。

### 平台類型的符號表示法

如上所述，平台類型無法在程式中顯式提及，因此該語言中沒有它們的語法。儘管如此，編譯器和 IDE 有時需要顯示它們（例如，在錯誤訊息或參數資訊中），因此它們有一個助記符號表示法：

* `T!` 表示 "`T` 或 `T?`"
* `(Mutable)Collection<T>!` 表示 "Java 的 `T` 集合可能是可變的或不可變的，可能是可空的或不可空的"
* `Array<(out) T>!` 表示 "Java 的 `T` 陣列（或 `T` 的子類型），可空的或不可空的"

### 可空性註解（Nullability annotations）

具有可空性註解的 Java 類型不會被表示為平台類型，而是表示為實際的可空或非可空的 Kotlin 類型。編譯器支援多種可空性註解，包括：

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
（來自 `org.jetbrains.annotations` 套件的 `@Nullable` 和 `@NotNull`）
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`，更多細節請參閱下文)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

您可以指定編譯器是否基於來自特定類型的可空性註解的信息來報告可空性不匹配。使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在參數中，指定完全限定的可空性註解套件和以下報告級別之一：
* `ignore` 忽略可空性不匹配
* `warn` 報告警告
* `strict` 報告錯誤。

請參閱 [Kotlin 編譯器原始碼](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt) 中支援的可空性註解的完整列表。

### 註解類型參數和類型形參

您可以註解泛型類型的類型參數和類型形參，以提供它們的可空性資訊。

:::note
本節中的所有範例都使用來自 `org.jetbrains.annotations` 套件的 JetBrains 可空性註解。

:::

#### 類型參數

考慮以下 Java 聲明上的註解：

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

它們在 Kotlin 中產生以下簽名：

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

如果類型參數中缺少 `@NotNull` 註解，您將獲得一個平台類型：

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin 還會考慮基底類別和介面的類型參數上的可空性註解。例如，有兩個 Java 類別具有下面提供的簽名：

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

在 Kotlin 程式碼中，在假定 `Base<String>` 的地方傳遞 `Derived` 的實例會產生警告。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // 警告：可空性不匹配
}
```

`Derived` 的上限設定為 `Base<String?>`，這與 `Base<String>` 不同。

了解更多關於 [Kotlin 中的 Java 泛型](java-interop#java-generics-in-kotlin)。

#### 類型形參

預設情況下，Kotlin 和 Java 中普通類型形參的可空性未定義。在 Java 中，您可以使用可空性註解指定它。讓我們註解 `Base` 類別的類型形參：

```java
public class Base<@NotNull T> {}
```

從 `Base` 繼承時，Kotlin 期望一個非空值的類型參數或類型形參。因此，以下 Kotlin 程式碼會產生警告：

```kotlin
class Derived<K> : Base<K> {} // 警告：K 的可空性未定義
```

您可以透過指定上限 `K : Any` 來解決此問題。

Kotlin 還支援 Java 類型形參邊界上的可空性註解。讓我們將邊界新增到 `Base`：

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin 會將其翻譯如下：

```kotlin
class BaseWithBound<T : Number> {}
```

因此，將可空類型作為類型參數或類型形參傳遞會產生警告。

註解類型參數和類型形參適用於 Java 8 目標或更高版本。該功能要求可空性註解支援 `TYPE_USE` 目標（`org.jetbrains.annotations` 在 15 及更高版本中支援此功能）。

:::note
如果可空性註解除了 `TYPE_USE` 目標之外還支援適用於類型的其他目標，則 `TYPE_USE` 優先。例如，如果 `@Nullable` 同時具有 `TYPE_USE` 和 `METHOD` 目標，則 Java 方法簽名 `@Nullable String[] f()` 在 Kotlin 中變為 `fun f(): Array<String?>!`。

:::

### JSR-305 支援

[JSR-305](https://jcp.org/en/jsr/detail?id=305) 中定義的 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 註解支援用於表示 Java 類型的可空性。

如果 `@Nonnull(when = ...)` 的值為 `When.ALWAYS`，則帶註解的類型被視為非可空的；`When.MAYBE` 和 `When.NEVER` 表示可空類型；而 `When.UNKNOWN` 強制該類型為 [平台類型](#null-safety-and-platform-types)。

一個函式庫可以針對 JSR-305 註解進行編譯，但沒有必要將註解成品（例如 `jsr305.jar`）作為函式庫使用者的編譯依賴項。Kotlin 編譯器可以從函式庫讀取 JSR-305 註解，而無需註解出現在類別路徑（classpath）上。

也支援 [自訂可空性限定符（KEEP-79）](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers)（請參閱下文）。

#### 類型限定符暱稱（Type qualifier nicknames）

如果註解類型同時使用
[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
和 JSR-305 `@Nonnull`（或其另一個暱稱，例如 `@CheckForNull`）進行註解，則該註解類型本身用於檢索精確的可空性，並且具有與該可空性註解相同的含義：

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 另一個類型限定符暱稱的暱稱
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // 在 Kotlin 中（嚴格模式）：`fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // 在 Kotlin 中（嚴格模式）：`fun bar(x: List<String>!): String!`
}
```

#### 類型限定符預設值（Type qualifier defaults）

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
允許引入註解，這些註解在應用時，定義了帶註解元素範圍內的預設可空性。

此類註解類型本身應同時使用 `@Nonnull`（或其暱稱）和 `@TypeQualifierDefault(...)` 以及一個或多個 `ElementType` 值進行註解：

* `ElementType.METHOD` 用於方法的返回類型
* `ElementType.PARAMETER` 用於值參數
* `ElementType.FIELD` 用於欄位
* `ElementType.TYPE_USE` 用於任何類型，包括類型參數、類型形參的上限和萬用字元類型

當類型本身未通過可空性註解進行註解時，使用預設可空性，並且預設值由使用類型限定符預設註解的最近的封閉元素（`ElementType` 與類型使用相匹配）確定。

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // fun foo(x: String?): String?

    @NotNullApi // 覆蓋介面中的預設值
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // 由於 `@NullableApi` 具有 `TYPE_USE` 元素類型，因此 List<String> 類型參數被視為可空：
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // 由於存在顯式的 UNKNOWN 標記的可空性註解，因此 `x` 參數的類型保持為平台類型：
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

:::note
此範例中的類型僅在啟用嚴格模式時才生效；否則，平台類型保持不變。
請參閱 [`@UnderMigration` 註解](#undermigration-annotation) 和 [編譯器配置](#compiler-configuration) 章節。

:::

也支援套件級別的預設可空性：

```java
// FILE: test/package-info.java
@NonNullApi // 宣告套件 'test' 中的所有類型預設情況下為非可空的
package test;
```

#### @UnderMigration 註解

函式庫維護人員可以使用 `@UnderMigration` 註解（在單獨的成品 `kotlin-annotations-jvm` 中提供）來定義可空性類型限定符的遷移狀態。

`@UnderMigration(status = ...)` 中的狀態值指定了編譯器如何處理 Kotlin 中帶註解類型的不當使用（例如，將 `@MyNullable` 註解的類型值用作非空值）：

* `MigrationStatus.STRICT` 使註解像任何普通的可空性註解一樣工作，即報告不當使用的錯誤，並影響帶註解聲明中的類型，因為它們在 Kotlin 中可見
* `MigrationStatus.WARN`：不當使用報告為編譯警告而不是錯誤，但帶註解聲明中的類型保持為平台類型
* `MigrationStatus.IGNORE` 使編譯器完全忽略可空性註解

函式庫維護人員可以將 `@UnderMigration` 狀態新增到類型限定符暱稱和類型限定符預設值：

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 類別中的類型是非可空的，但僅報告警告
// 因為 `@NonNullApi` 註解了 `@UnderMigration(status = MigrationStatus.WARN)`
@NonNullApi
public class Test {}
```

:::note
可空性註解的遷移狀態不會被其類型限定符暱稱繼承，而是應用於預設類型限定符中的使用。

:::

如果預設類型限定符使用類型限定符暱稱，並且它們都使用 `@UnderMigration`，則使用來自預設類型限定符的狀態。

#### 編譯器配置

可以通過新增帶有以下選項（及其組合）的 `-Xjsr305` 編譯器標誌來配置 JSR-305 檢查：

* `-Xjsr305=\{strict|warn|ignore\}` 設置非 `@UnderMigration` 註解的行為。
自訂可空性限定符，尤其是
`@TypeQualifierDefault`，已經分佈在許多著名的函式庫中，並且使用者在更新到包含 JSR-305 支援的 Kotlin 版本時可能需要平滑地遷移。自 Kotlin 1.1.60 以來，此標誌僅影響非 `@UnderMigration` 註解。

* `-Xjsr305=under-migration:\{strict|warn|ignore\}` 覆蓋 `@UnderMigration` 註解的行為。
使用者可能對函式庫的遷移狀態有不同的看法：
他們可能希望在官方遷移狀態為 `WARN` 時出現錯誤，或者反之亦然，
他們可能希望推遲報告某些錯誤，直到他們完成遷移。

* `-Xjsr305=@<fq.name>:\{strict|warn|ignore\}` 覆蓋單個註解的行為，其中 `<fq.name>` 是註解的完全限定類別名稱。可能多次出現，用於不同的註解。這對於管理特定函式庫的遷移狀態很有用。

`strict`、`warn` 和 `ignore` 值與 `MigrationStatus` 的值具有相同的含義，並且只有 `strict` 模式會影響帶註解聲明中的類型，因為它們在 Kotlin 中可見。

:::note
注意：內建的 JSR-305 註解 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 和
[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) 始終啟用並且
會影響 Kotlin 中帶註解聲明的類型，無論使用 `-Xjsr305` 標誌的編譯器配置如何。

:::

例如，將 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` 新增到
編譯器參數使編譯器為由 `@org.library.MyNullable` 註解的類型的不當使用生成警告，並忽略所有其他 JSR-305 註解。

預設行為與 `-Xjsr305=warn` 相同。
`strict` 值應被視為實驗性的（將來可能會將更多檢查新增到其中）。

## 對應類型（Mapped types）

Kotlin 會特別處理某些 Java 類型。這些類型不會從 Java「按原樣」載入，而是 _mapped_ 到對應的 Kotlin 類型。
映射僅在編譯時有意義，運行時表示保持不變。
Java 的原始類型（primitive types）會映射到對應的 Kotlin 類型（請記住 [平台類型](#null-safety-and-platform-types)）：

| **Java 類型** | **Kotlin 類型**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

一些非原始的內建類別也會被映射：

| **Java 類型** | **Kotlin 類型**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.annotation.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |

Java 的盒裝原始類型（boxed primitive types）會映射到可空的 Kotlin 類型：

| **Java 類型**           | **Kotlin 類型**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

請注意，用作類型參數的盒裝原始類型會映射到平台類型：
例如，`List<java.lang.Integer>` 在 Kotlin 中變為 `List<Int!>`。

集合類型在 Kotlin 中可能是唯讀的或可變的，因此 Java 的集合映射如下
（此表中的所有 Kotlin 類型都位於 `kotlin.collections` 套件中）：

| **Java 類型** | **Kotlin 唯讀類型**  | **Kotlin 可變類型** | **載入的平台類型** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Java 的陣列如 [下文](#java-arrays) 所述進行映射：

| **Java 類型** | **Kotlin 類型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |
:::note
這些 Java 類型的靜態成員無法直接在 Kotlin 類型的 [伴生物件（companion objects）](object-declarations#companion-objects) 上存取。要呼叫它們，請使用 Java 類型的完整限定名稱，例如 `java.lang.Integer.toHexString(foo)`。

:::

## Kotlin 中的 Java 泛型（Java generics）

Kotlin 的泛型與 Java 的泛型略有不同（請參閱 [泛型](generics)）。
將 Java 類型導入到 Kotlin 時，會執行以下轉換：

* Java 的萬用字元會轉換為類型投影：
  * `Foo<? extends Bar>` 變為 `Foo<out Bar!>!`
  * `Foo<? super Bar>` 變為 `Foo<in Bar!>!`

* Java 的原始類型（raw types）會轉換為星號投影：
  * `List` 變為 `List<*>!`，即 `List<out Any?>!`

與 Java 的泛型一樣，Kotlin 的泛型不會在運行時保留：物件不攜帶關於傳遞給其建構子的實際類型參數的資訊。例如，`ArrayList<Integer>()` 與 `ArrayList<Character>()` 無法區分。
這使得執行考慮泛型的 `is`-checks 變得不可能。
Kotlin 僅允許對星號投影的泛型類型進行 `is`-checks：

```kotlin
if (a is List<Int>) // 錯誤：無法檢查它是否真的是 Ints 的 List
// 但是
if (a is List<*>) // 確定：無法保證列表的內容
```

## Java 陣列（Java arrays）

Kotlin 中的陣列是不變的（invariant），與 Java 不同。這意味著 Kotlin 不允許您將 `Array<String>` 賦值給 `Array<Any>`，
這可以防止可能的運行時故障。也禁止將子類別的陣列作為超類別的陣列傳遞給 Kotlin 方法，
但對於 Java 方法，這是允許的，透過 `Array<(out) String>!` 形式的 [平台類型](#null-safety-and-platform-types)。

陣列與 Java 平台上的原始資料類型一起使用，以避免裝箱/拆箱操作的成本。
由於 Kotlin 隱藏了這些實現細節，因此需要一種解決方法來與 Java 程式碼互動。
對於每種類型的原始陣列（`IntArray`、`DoubleArray`、`CharArray` 等），都有專門的類別來處理這種情況。
它們與 `Array` 類別無關，並且被編譯為 Java 的原始陣列，以實現最大效能。

假設有一個 Java 方法接受 int 索引陣列：

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

要傳遞原始值的陣列，您可以在 Kotlin 中執行以下操作：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // 將 int[] 傳遞給方法
```

編譯為 JVM 位元組碼時，編譯器會最佳化對陣列的存取，因此不會引入任何開銷：

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // 沒有產生對 get() 和 set() 的實際呼叫
for (x in array) { // 沒有建立迭代器
    print(x)
}
```

即使您使用索引導航，也不會引入任何開銷：

```kotlin
for (i in array.indices) { // 沒有建立迭代器
    array[i] += 2
}
```

最後，`in`-checks 也沒有任何開銷：

```kotlin
if (i in array.indices) { // 與 (i >= 0 && i < array.size) 相同
    print(array[i])
}
```

## Java 可變參數（Java varargs）

Java 類別有時會使用帶有可變數量參數 (varargs) 的索引的方法聲明：

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

在這種情況下，您需要使用展開運算符（spread operator） `*` 來傳遞 `IntArray`：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 運算符（Operators）

由於 Java 無法標記適合使用運算符語法的方法，因此 Kotlin 允許使用任何
具有正確名稱和簽名的 Java 方法作為運算符重載和其他約定（`invoke()` 等）。
不允許使用 infix 呼叫語法呼叫 Java 方法。

## 受檢異常（Checked exceptions）

在 Kotlin 中，所有 [異常都是未受檢的（unchecked）](exceptions)，這意味著編譯器不會強迫您捕獲任何異常。
因此，當您呼叫聲明受檢異常的 Java 方法時，Kotlin 不會強迫您做任何事情：

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java 會要求我們在此處捕獲 IOException
    }
}
```

## 物件方法（Object methods）

將 Java 類型導入到 Kotlin 時，類型 `java.lang.Object` 的所有引用都會轉換為 `Any`。
由於 `Any` 不是平台特定的，因此它只聲明 `toString()`、`hashCode()` 和 `equals()` 作為其成員，
因此為了使 `java.lang.Object` 的其他成員可用，Kotlin 使用 [擴充函數（extension functions）](extensions)。

### wait()/notify()

方法 `wait()` 和 `notify()` 在 `Any` 類型的引用上不可用。通常不鼓勵使用它們
而傾向於使用 `java.util.concurrent`。如果您確實需要呼叫這些方法，您可以強制轉換為 `java.lang.Object`：

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

要檢索物件的 Java 類別，請在 [類別參考（class reference）](reflection#class-references) 上使用 `java` 擴充屬性：

```kotlin
val fooClass = foo::class.java
```

上面的程式碼使用 [綁定類別參考（bound class reference）](reflection#bound-class-references)。您也可以使用 `javaClass` 擴充屬性：

```kotlin
val fooClass = foo.javaClass
```

### clone()

要覆寫 `clone()`，您的類別需要擴充 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

別忘了 [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 13: *Override clone judiciously*。

### finalize()

要覆寫 `finalize()`，您只需聲明它，而無需使用 `override` 關鍵字：

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
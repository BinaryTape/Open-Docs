[//]: # (title: 從 Kotlin 呼叫 Java)

Kotlin 的設計考量了與 Java 的互通性。現有的 Java 程式碼可以自然地從 Kotlin 中呼叫，而 Kotlin 程式碼也可以相當流暢地從 Java 中使用。本節將詳細說明從 Kotlin 呼叫 Java 程式碼的一些細節。

幾乎所有 Java 程式碼都可以毫無問題地使用：

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for'-loops work for Java collections:
    for (item in source) {
        list.add(item)
    }
    // Operator conventions work as well:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get and set are called
    }
}
```

## 讀取器與設定器

遵循 Java 慣例的讀取器與設定器方法 (名稱以 `get` 開頭且無參數的方法，以及名稱以 `set` 開頭且單一參數的方法) 在 Kotlin 中表示為屬性。這類屬性也稱為 _合成屬性_ (synthetic properties)。`Boolean` 存取方法 (讀取器名稱以 `is` 開頭，設定器名稱以 `set` 開頭) 則表示為與讀取器方法同名的屬性。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // call getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY // call setFirstDayOfWeek()
    }
    if (!calendar.isLenient) { // call isLenient()
        calendar.isLenient = true // call setLenient()
    }
}
```

上方 `calendar.firstDayOfWeek` 是一個合成屬性的範例。

請注意，如果 Java 類別只有一個設定器，它在 Kotlin 中不會被視為屬性，因為 Kotlin 不支援僅設定的屬性。

## Java 合成屬性參考

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或變更。
> 我們建議您僅將其用於評估目的。
>
{style="warning"}

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

Kotlin 始終允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您還可以建立對 `Person::age` 和 `person::age` 的參考。這也適用於 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
         // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```

### 如何啟用 Java 合成屬性參考 {initial-collapse-state="collapsed" collapsible="true"}

若要啟用此功能，請設定 `-language-version 2.1` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增到 `build.gradle(.kts)` 中來實現：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</tab>
</tabs>

> 在 Kotlin 1.9.0 之前，要啟用此功能，您必須設定 `-language-version 1.9` 編譯器選項。
> 
{style="note"}

## 傳回 `void` 的方法

如果 Java 方法傳回 `void`，從 Kotlin 呼叫時它將傳回 `Unit`。
如果有人碰巧使用了該傳回值，由於該值本身是預先知道的 (`Unit`)，它將由 Kotlin 編譯器在呼叫點被賦值。

## 針對 Kotlin 關鍵字的 Java 識別符號進行逸出

一些 Kotlin 關鍵字在 Java 中是有效的識別符號：例如 `in`、`object`、`is` 等。
如果 Java 函式庫使用 Kotlin 關鍵字作為方法名稱，您仍然可以透過使用反引號 (`) 字元將其逸出以呼叫該方法：

```kotlin
foo.`is`(bar)
```

## 空值安全與平台類型

Java 中的任何參考都可能為 `null`，這使得 Kotlin 對嚴格空值安全的要求對於來自 Java 的物件來說不切實際。
Java 宣告的類型在 Kotlin 中以特定方式處理，並稱為 *平台類型* (platform types)。對於這類類型，空值檢查會放鬆，因此它們的安全保證與 Java 中相同 (詳情請見 [下方](#mapped-types))。

考慮以下範例：

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

當您在平台類型的變數上呼叫方法時，Kotlin 在編譯時不會發出可空性錯誤，但呼叫可能在執行時失敗，原因可能是空指標異常 (null-pointer exception) 或 Kotlin 為了防止空值傳播而生成的斷言 (assertion)：

```kotlin
item.substring(1) // allowed, throws an exception if item == null
```

平台類型是 *不可表示的* (non-denotable)，這表示您無法在語言中明確地寫下它們。
當一個平台值被賦予 Kotlin 變數時，您可以依賴類型推斷 (變數將具有推斷的平台類型，如上述範例中的 `item`)，或者您可以選擇您期望的類型 (允許可空和不可空類型)：

```kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

如果您選擇非可空類型，編譯器會在賦值時發出斷言。這可以防止 Kotlin 的非可空變數持有空值。當您將平台值傳遞給期望非空值的 Kotlin 函式以及在其他情況下，也會發出斷言。
總體而言，編譯器會盡力防止空值在程式中傳播太遠，儘管有時由於泛型的原因，這無法完全消除。

### 平台類型的表示法

如前所述，平台類型不能在程式中明確提及，因此語言中沒有它們的語法。
然而，編譯器和 IDE 有時需要顯示它們 (例如，在錯誤訊息或參數資訊中)，因此有一個助記符號：

* `T!` 表示 "`T` 或 `T?`"
* `(Mutable)Collection<T>!` 表示 "Java 集合 `T` 可能可變或不可變，可能可空或不可空"
* `Array<(out) T>!` 表示 "Java 陣列 `T` (或 `T` 的子類型)，可空或不可空"

### 可空性註解

具有可空性註解的 Java 類型不會表示為平台類型，而是表示為實際的可空或不可空 Kotlin 類型。編譯器支援多種可空性註解，包括：

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`@Nullable` 和 `@NotNull` 來自 `org.jetbrains.annotations` 套件)
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`，更多細節見下方)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

您可以根據特定類型可空性註解中的資訊，指定編譯器是否報告可空性不匹配。使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在引數中，指定完全限定的可空性註解套件和以下其中一個報告級別：
* `ignore` 以忽略可空性不匹配
* `warn` 以報告警告
* `strict` 以報告錯誤。

請參閱 [Kotlin 編譯器原始碼](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt) 中支援的可空性註解完整列表。

### 註解類型實參與類型參數

您也可以註解泛型類型的類型實參和類型參數，以提供它們的可空性資訊。

> 本節所有範例均使用來自 `org.jetbrains.annotations` 套件的 JetBrains 可空性註解。
>
{style="note"}

#### 類型實參

考慮 Java 宣告上的這些註解：

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

它們在 Kotlin 中產生以下簽章：

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

當類型實參中缺少 `@NotNull` 註解時，您將得到一個平台類型：

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin 也會考慮基類和介面類型實參上的可空性註解。例如，
有兩個 Java 類別，其簽章如下：

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

在 Kotlin 程式碼中，將 `Derived` 的實例傳遞給預期 `Base<String>` 的地方會產生警告。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived` 的上限設定為 `Base<String?>`，這與 `Base<String>` 不同。

了解更多關於 [Kotlin 中的 Java 泛型](#java-generics-in-kotlin)。

#### 類型參數

預設情況下，Kotlin 和 Java 中普通類型參數的可空性是未定義的。在 Java 中，您可以
使用可空性註解指定它。讓我們註解 `Base` 類別的類型參數：

```java
public class Base<@NotNull T> {}
```

從 `Base` 繼承時，Kotlin 期望一個非可空類型實參或類型參數。
因此，以下 Kotlin 程式碼會產生警告：

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

您可以透過指定上限 `K : Any` 來修復它。

Kotlin 也支援 Java 類型參數邊界上的可空性註解。讓我們為 `Base` 新增邊界：

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin 將其直接翻譯為：

```kotlin
class BaseWithBound<T : Number> {}
```

因此，將可空類型作為類型實參或類型參數傳遞會產生警告。

註解類型實參和類型參數適用於 Java 8 或更高版本。該功能要求可空性註解支援 `TYPE_USE` 目標 (`org.jetbrains.annotations` 在版本 15 及更高版本中支援此功能)。

> 如果可空性註解除了 `TYPE_USE` 目標之外，還支援適用於類型的其他目標，則 `TYPE_USE` 具有優先權。例如，如果 `@Nullable` 具有 `TYPE_USE` 和 `METHOD` 目標，則 Java 方法簽章 `@Nullable String[] f()` 在 Kotlin 中變成 `fun f(): Array<String?>!`。
>
{style="note"}

### JSR-305 支援

[JSR-305](https://jcp.org/en/jsr/detail?id=305) 中定義的 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 註解支援用於表示 Java 類型的可空性。

如果 `@Nonnull(when = ...)` 值為 `When.ALWAYS`，則註解的類型被視為不可空；`When.MAYBE` 和
`When.NEVER` 表示可空類型；`When.UNKNOWN` 則強制類型為 [平台類型](#null-safety-and-platform-types)。

函式庫可以針對 JSR-305 註解進行編譯，但無需將註解構件 (例如 `jsr305.jar`)
作為函式庫使用者的編譯依賴。Kotlin 編譯器可以在沒有註解出現在類路徑上的情況下從函式庫讀取 JSR-305 註解。

[自訂可空性限定符 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md)
也受支援 (見下方)。

#### 類型限定符暱稱

如果註解類型同時被 [`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
和 JSR-305 `@Nonnull` (或其另一個暱稱，例如 `@CheckForNull`) 註解，則該註解類型本身用於
獲取精確的可空性，並具有與該可空性註解相同的含義：

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // a nickname to another type qualifier nickname
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // in Kotlin (strict mode): `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // in Kotlin (strict mode): `fun bar(x: List<String>!): String!`
}
```

#### 類型限定符預設值

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
允許引入註解，這些註解在應用時定義註解元素範圍內的預設可空性。

此類註解類型本身應同時被 `@Nonnull` (或其暱稱) 和 `@TypeQualifierDefault(...)` 註解，
並帶有一個或多個 `ElementType` 值：

* `ElementType.METHOD` 用於方法的回傳類型
* `ElementType.PARAMETER` 用於值參數
* `ElementType.FIELD` 用於欄位
* `ElementType.TYPE_USE` 用於任何類型，包括類型實參、類型參數的上限和萬用字元類型

當類型本身未被可空性註解，且預設值由最內部封閉元素決定時，將使用預設可空性，
該元素用類型限定符預設註解註解，且其 `ElementType` 與類型用法匹配。

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

    @NotNullApi // overriding default from the interface
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // The List<String> type argument is seen as nullable because of `@NullableApi`
    // having the `TYPE_USE` element type:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // The type of `x` parameter remains platform because there's an explicit
    // UNKNOWN-marked nullability annotation:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

> 此範例中的類型僅在嚴格模式啟用時生效；否則，平台類型保持不變。
> 請參閱 [`@UnderMigration` 註解](#undermigration-annotation) 和 [編譯器配置](#compiler-configuration) 部分。
>
{style="note"}

套件級別的預設可空性也受支援：

```java
// FILE: test/package-info.java
@NonNullApi // declaring all types in package 'test' as non-nullable by default
package test;
```

#### @UnderMigration 註解

[`@UnderMigration`](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlin-annotations-jvm/src/main/java/kotlin/annotations/jvm/UnderMigration.java) 註解 (在單獨的構件 `kotlin-annotations-jvm` 中提供) 可供函式庫維護者用於定義可空性類型限定符的遷移狀態。

[`@UnderMigration(status = ...)`](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlin-annotations-jvm/src/main/java/kotlin/annotations/jvm/MigrationStatus.java) 中的狀態值指定了編譯器如何處理 Kotlin 中註解類型的不適當用法 (例如，將 `@MyNullable` 註解的類型值用作非空值)：

* `MigrationStatus.STRICT` 使註解像任何普通的可空性註解一樣工作，即報告不適當用法的錯誤，並影響 Kotlin 中所見的註解宣告中的類型。
* `MigrationStatus.WARN`：不適當的用法會報告為編譯警告而非錯誤，但註解宣告中的類型仍保留平台類型。
* `MigrationStatus.IGNORE` 使編譯器完全忽略可空性註解。

函式庫維護者可以將 `@UnderMigration` 狀態新增到類型限定符暱稱和類型限定符預設值：

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// The types in the class are non-nullable, but only warnings are reported
// because `@NonNullApi` is annotated `@UnderMigration(status = MigrationStatus.WARN)`
@NonNullApi
public class Test {}
```

> 可空性註解的遷移狀態不會被其類型限定符暱稱繼承，但會應用於其在預設類型限定符中的用法。
>
{style="note"}

如果預設類型限定符使用類型限定符暱稱，並且它們都標有 `@UnderMigration`，則使用預設類型限定符的狀態。

#### 編譯器配置

JSR-305 檢查可以透過添加 `-Xjsr305` 編譯器標誌並配合以下選項 (及其組合) 進行配置：

* `-Xjsr305={strict|warn|ignore}` 用於設定非 `@UnderMigration` 註解的行為。
自訂可空性限定符，特別是
`@TypeQualifierDefault`，已廣泛分佈於許多知名函式庫中，使用者在更新到包含 JSR-305 支援的 Kotlin 版本時可能需要平穩遷移。從 Kotlin 1.1.60 開始，此標誌僅影響非 `@UnderMigration` 註解。

* `-Xjsr305=under-migration:{strict|warn|ignore}` 用於覆寫 `@UnderMigration` 註解的行為。
使用者對於函式庫的遷移狀態可能有不同的看法：
他們可能希望在官方遷移狀態為 `WARN` 時出現錯誤，反之亦然，
他們可能希望推遲某些錯誤的報告，直到他們完成遷移。

* `-Xjsr305=@<fq.name>:{strict|warn|ignore}` 用於覆寫單個註解的行為，其中 `<fq.name>`
是註解的完全限定類別名稱。可以多次出現，用於不同的註解。這對於管理特定函式庫的遷移狀態很有用。

`strict`、`warn` 和 `ignore` 值與 `MigrationStatus` 的含義相同，
並且只有 `strict` 模式會影響 Kotlin 中所見的註解宣告中的類型。

> 注意：內建的 JSR-305 註解 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
> [`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 和
> [`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) 始終啟用並
> 影響 Kotlin 中註解宣告的類型，無論 `-Xjsr305` 標誌的編譯器配置如何。
>
{style="note"}

例如，將 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` 添加到
編譯器引數中，將使編譯器為由 `@org.library.MyNullable` 註解的類型的不適當用法生成警告，
並忽略所有其他 JSR-305 註解。

預設行為與 `-Xjsr305=warn` 相同。`strict` 值應被視為實驗性 (將來可能會新增更多檢查)。

## 映射類型

Kotlin 會特別處理某些 Java 類型。這類類型不會「原樣」從 Java 載入，而是 _映射_ 到對應的 Kotlin 類型。
映射僅在編譯時有意義，執行時表示保持不變。
Java 的基本類型映射到對應的 Kotlin 類型 (考慮到 [平台類型](#null-safety-and-platform-types))：

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

一些非基本內建類別也已映射：

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

Java 的裝箱基本類型映射到可空的 Kotlin 類型：

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

請注意，用作類型參數的裝箱基本類型會映射到平台類型：
例如，`List<java.lang.Integer>` 在 Kotlin 中變成 `List<Int!>`。

集合類型在 Kotlin 中可能是唯讀或可變的，因此 Java 的集合映射如下
(此表中的所有 Kotlin 類型都位於 `kotlin.collections` 套件中)：

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

Java 的陣列映射如下 [下方](#java-arrays) 所述：

| **Java 類型** | **Kotlin 類型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |

>這些 Java 類型的靜態成員無法直接在 Kotlin 類型的 [伴隨物件](object-declarations.md#companion-objects) 上存取。若要呼叫它們，請使用 Java 類型的完全限定名稱，例如 `java.lang.Integer.toHexString(foo)`。
>
{style="note"}

## Kotlin 中的 Java 泛型

Kotlin 的泛型與 Java 的泛型略有不同 (請參閱 [泛型](generics.md))。
將 Java 類型導入 Kotlin 時，會執行以下轉換：

* Java 的萬用字元轉換為類型投射 (type projections)：
  * `Foo<? extends Bar>` 變成 `Foo<out Bar!>!`
  * `Foo<? super Bar>` 變成 `Foo<in Bar!>!`

* Java 的原始類型 (raw types) 轉換為星號投射 (star projections)：
  * `List` 變成 `List<*>!`，即 `List<out Any?>!`

與 Java 類似，Kotlin 的泛型在執行時不保留：物件不攜帶關於傳遞給其建構函式的實際類型實參的資訊。例如，`ArrayList<Integer>()` 與 `ArrayList<Character>()` 無法區分。
這使得執行考慮泛型的 `is` 檢查變得不可能。
Kotlin 只允許對星號投射的泛型類型進行 `is` 檢查：

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java 陣列

Kotlin 中的陣列是不變的 (invariant)，與 Java 不同。這意味著 Kotlin 不會讓您將 `Array<String>` 賦值給 `Array<Any>`，這可以防止潛在的執行時失敗。將子類別的陣列作為超類別的陣列傳遞給 Kotlin 方法也是禁止的，
但對於 Java 方法，這透過形式為 `Array<(out) String>!` 的 [平台類型](#null-safety-and-platform-types) 允許。

在 Java 平台上，陣列與基本資料類型一起使用，以避免裝箱/拆箱操作的成本。
由於 Kotlin 隱藏了這些實作細節，因此需要一個解決方案來與 Java 程式碼介面。
針對每種基本陣列類型 (`IntArray`、`DoubleArray`、`CharArray` 等) 都有專門的類別來處理此情況。
它們與 `Array` 類別無關，並編譯為 Java 的基本陣列以獲得最大效能。

假設有一個 Java 方法接受一個整數索引陣列：

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

若要傳遞一個基本值陣列，您可以在 Kotlin 中執行以下操作：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

編譯為 JVM 位元碼時，編譯器會優化陣列存取，使其不會產生任何額外開銷：

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // no actual calls to get() and set() generated
for (x in array) { // no iterator created
    print(x)
}
```

即使您使用索引導航，它也不會產生任何額外開銷：

```kotlin
for (i in array.indices) { // no iterator created
    array[i] += 2
}
```

最後，`in` 檢查也沒有額外開銷：

```kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
    print(array[i])
}
```

## Java 可變參數

Java 類別有時會使用具有可變數量的引數 (varargs) 的方法宣告作為索引：

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

在這種情況下，您需要使用展開運算子 `*` 來傳遞 `IntArray`：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 運算子

由於 Java 無法標記哪些方法適合使用運算子語法，Kotlin 允許使用任何名稱和簽章正確的 Java 方法作為運算子多載和其他約定 (例如 `invoke()`)。
不允許使用中綴呼叫語法呼叫 Java 方法。

## 受檢異常

在 Kotlin 中，所有 [異常都是未受檢的](exceptions.md)，這表示編譯器不會強制您捕獲其中任何一個。
因此，當您呼叫宣告受檢異常的 Java 方法時，Kotlin 不會強制您執行任何操作：

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java would require us to catch IOException here
    }
}
```

## 物件方法

當 Java 類型導入 Kotlin 時，類型為 `java.lang.Object` 的所有參考都會轉換為 `Any`。
由於 `Any` 不是平台特定的，它只宣告 `toString()`、`hashCode()` 和 `equals()` 作為其成員，
因此為了使 `java.lang.Object` 的其他成員可用，Kotlin 使用 [擴充函式](extensions.md)。

### wait()/notify()

`wait()` 和 `notify()` 方法在 `Any` 類型的參考上不可用。通常不鼓勵使用它們，建議使用 `java.util.concurrent`。如果您確實需要呼叫這些方法，可以轉換為 `java.lang.Object`：

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

若要擷取物件的 Java 類別，請在 [類別參考](reflection.md#class-references) 上使用 `java` 擴充屬性：

```kotlin
val fooClass = foo::class.java
```

上述程式碼使用 [綁定類別參考](reflection.md#bound-class-references)。您也可以使用 `javaClass` 擴充屬性：

```kotlin
val fooClass = foo.javaClass
```

### clone()

若要覆寫 `clone()`，您的類別需要繼承 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

別忘了 [Effective Java, 第 3 版](https://www.oracle.com/technetwork/java/effectivejava-136174.html)，第 13 項：*謹慎地覆寫 clone*。

### finalize()

若要覆寫 `finalize()`，您只需簡單地宣告它，而無需使用 `override` 關鍵字：

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
    }
}
```

根據 Java 的規則，`finalize()` 不得為 `private`。

## 繼承自 Java 類別

在 Kotlin 中，最多一個 Java 類別 (以及任意數量的 Java 介面) 可以作為類別的超類型。

## 存取靜態成員

Java 類別的靜態成員為這些類別形成「伴隨物件」(companion objects)。您無法將此類「伴隨物件」作為值傳遞，但可以明確存取其成員，例如：

```kotlin
if (Character.isLetter(a)) { ... }
```

若要存取映射到 Kotlin 類型的 Java 類型的靜態成員，請使用 Java 類型的完全限定名稱：`java.lang.Integer.bitCount(foo)`。

## Java 反射

Java 反射適用於 Kotlin 類別，反之亦然。如上所述，您可以使用 `instance::class.java`、
`ClassName::class.java` 或 `instance.javaClass` 透過 `java.lang.Class` 進入 Java 反射。
請勿為此目的使用 `ClassName.javaClass`，因為它指向 `ClassName` 的伴隨物件類別，
這與 `ClassName.Companion::class.java` 相同，而不是 `ClassName::class.java`。

對於每個基本類型，有兩個不同的 Java 類別，Kotlin 提供了獲取這兩者的方法。例如，
`Int::class.java` 將返回表示基本類型本身的類別實例，
對應於 Java 中的 `Integer.TYPE`。若要獲取對應包裝器類型的類別，請使用
`Int::class.javaObjectType`，這等同於 Java 的 `Integer.class`。

其他支援的案例包括獲取 Kotlin 屬性的 Java 讀取器/設定器方法或後備欄位 (backing field)，Java 欄位的 `KProperty`，以及 Java 方法或建構函式的 `KFunction`，反之亦然。

## SAM 轉換

Kotlin 支援 Java 和 [Kotlin 介面](fun-interfaces.md) 的 SAM 轉換。
對於 Java，這意味著 Kotlin 函式字面值 (function literals) 可以自動轉換為
僅包含單一非預設方法的 Java 介面實現，只要介面方法的參數類型與
Kotlin 函式的參數類型匹配即可。

您可以將此用於建立 SAM 介面實例：

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...以及在方法呼叫中：

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果 Java 類別有多個接受函式式介面 (functional interfaces) 的方法，您可以透過
使用將 lambda 轉換為特定 SAM 類型的轉接函式 (adapter function) 來選擇需要呼叫的方法。
當需要時，這些轉接函式也由編譯器產生：

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM 轉換僅適用於介面，不適用於抽象類別，即使這些抽象類別也只有單一抽象方法。
>
{style="note"}

## 在 Kotlin 中使用 JNI

若要宣告一個在原生 (C 或 C++) 程式碼中實作的函式，您需要使用 `external` 修飾符標記它：

```kotlin
external fun foo(x: Int): Double
```

其餘程序與 Java 完全相同。

您也可以將屬性讀取器和設定器標記為 `external`：

```kotlin
var myProperty: String
    external get
    external set
```

在幕後，這將創建兩個函式 `getMyProperty` 和 `setMyProperty`，兩者都標記為 `external`。

## 在 Kotlin 中使用 Lombok 生成的宣告

您可以在 Kotlin 程式碼中使用 Java 的 Lombok 生成的宣告。
如果您需要在同一個混合 Java/Kotlin 模組中生成和使用這些宣告，
您可以在 [Lombok 編譯器外掛程式頁面](lombok.md) 上了解如何執行此操作。
如果您從另一個模組呼叫這些宣告，則無需使用此外掛程式來編譯該模組。
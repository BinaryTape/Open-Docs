[//]: # (title: 從 Kotlin 呼叫 Java)

Kotlin 的設計考量到與 Java 的互通性。現有的 Java 程式碼可以很自然地從 Kotlin 中呼叫，而 Kotlin 程式碼也能相當流暢地在 Java 中使用。本節將詳細說明如何從 Kotlin 呼叫 Java 程式碼。

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

## Getters 和 Setters

遵循 Java getter 和 setter 慣例的方法（無參數方法名稱以 `get` 開頭，單參數方法名稱以 `set` 開頭）在 Kotlin 中表示為屬性。這類屬性也稱為*合成屬性*。`Boolean` 存取器方法（其中 getter 方法的名稱以 `is` 開頭，setter 方法的名稱以 `set` 開頭）表示為與 getter 方法同名的屬性。

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

上方的 `calendar.firstDayOfWeek` 便是合成屬性的一個範例。

請注意，如果 Java 類別只有 setter，它在 Kotlin 中不會顯示為屬性，因為 Kotlin 不支援僅設定屬性。

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

Kotlin 始終允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您也可以建立對 `Person::age` 和 `person::age` 的參考。這也適用於 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
         // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```

### 如何啟用 Java 合成屬性參考 {initial-collapse-state="collapsed" collapsible="true"}

要啟用此功能，請設定 `-language-version 2.1` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增到您的 `build.gradle(.kts)` 來實現：

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

> 在 Kotlin 1.9.0 之前，要啟用此功能，您需要設定 `-language-version 1.9` 編譯器選項。
> 
{style="note"}

## 傳回 `void` 的方法

如果 Java 方法傳回 `void`，則從 Kotlin 呼叫時它將傳回 `Unit`。
如果有人碰巧使用了該傳回值，由於該值本身是預先已知的（為 `Unit`），Kotlin 編譯器將在呼叫點指派它。

## 針對 Kotlin 關鍵字的 Java 識別字逸脫

某些 Kotlin 關鍵字在 Java 中是有效的識別字：`in`、`object`、`is` 等。
如果 Java 函式庫使用 Kotlin 關鍵字作為方法，您仍然可以使用反引號 (`` ` ``) 字元逸脫它來呼叫該方法：

```kotlin
foo.`is`(bar)
```

## 空值安全與平台類型

Java 中的任何參考都可能為 `null`，這使得 Kotlin 對於來自 Java 的物件的嚴格空值安全要求變得不切實際。
Java 宣告的類型在 Kotlin 中以特定方式處理，並稱為*平台類型*。對於這類類型，空值檢查會放寬，因此它們的安全保證與 Java 中的相同（詳見[下方](#mapped-types)）。

考慮以下範例：

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

當您在平台類型變數上呼叫方法時，Kotlin 在編譯時不會發出空值性錯誤，但呼叫可能在執行時失敗，因為會發生空指標例外或 Kotlin 為了防止 `null` 值傳播而生成的斷言：

```kotlin
item.substring(1) // allowed, throws an exception if item == null
```

平台類型是*不可表示的*，這意味著您無法在語言中明確地編寫它們。
當平台值指派給 Kotlin 變數時，您可以依賴類型推斷（變數將具有推斷的平台類型，如上述範例中的 `item`），或者您可以選擇您期望的類型（允許可空和不可空類型）：

```kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

如果您選擇不可空類型，編譯器將在指派時發出斷言。這可以防止 Kotlin 的不可空變數持有 `null` 值。當您將平台值傳遞給期望非空值的 Kotlin 函數以及在其他情況下，也會發出斷言。
總體而言，儘管有時由於泛型而無法完全消除，但編譯器會盡力防止 `null` 值在程式中傳播太遠。

### 平台類型表示法

如前所述，平台類型無法在程式中明確提及，因此語言中沒有它們的語法。
然而，編譯器和 IDE 有時需要顯示它們（例如，在錯誤訊息或參數資訊中），因此有一種助記表示法：

* `T!` 表示 "`T` 或 `T?`"，
* `(Mutable)Collection<T>!` 表示 "Java 的 `T` 集合可能可變或不可變，可能可空或不可空"，
* `Array<(out) T>!` 表示 "Java 的 `T` 陣列（或 `T` 的子類型），可空或不可空"

### 空值性註解

具有空值性註解的 Java 類型不表示為平台類型，而是表示為實際的可空或不可空 Kotlin 類型。編譯器支援多種空值性註解風格，包括：

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`@Nullable` 和 `@NotNull` 來自 `org.jetbrains.annotations` 套件)
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`，更多細節見下方)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

您可以根據來自特定類型的空值性註解的資訊，指定編譯器是否報告空值性不匹配。使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在參數中，指定完全合格的空值性註解套件以及以下報告層級之一：
* `ignore` 忽略空值性不匹配
* `warn` 報告警告
* `strict` 報告錯誤。

請參閱 [Kotlin 編譯器原始碼](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)中支援的空值性註解完整列表。

### 註解型別引數與型別參數

您也可以註解泛型型別的型別引數和型別參數，以提供它們的空值性資訊。

> 本節中的所有範例都使用來自 `org.jetbrains.annotations` 套件的 JetBrains 空值性註解。
>
{style="note"}

#### 型別引數

考慮 Java 宣告中的這些註解：

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

它們在 Kotlin 中產生以下簽章：

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

當型別引數中缺少 `@NotNull` 註解時，您會得到一個平台類型：

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin 也會考慮基礎類別和介面中型別引數上的空值性註解。例如，有兩個 Java 類別，其簽章如下：

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

在 Kotlin 程式碼中，當假設 `Base<String>` 處傳遞 `Derived` 的實例時，會產生警告。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived` 的上限設定為 `Base<String?>`，這與 `Base<String>` 不同。

了解更多關於 [Kotlin 中的 Java 泛型](#java-generics-in-kotlin)。

#### 型別參數

預設情況下，Kotlin 和 Java 中普通型別參數的空值性是未定義的。在 Java 中，您可以使用空值性註解指定它。讓我們註解 `Base` 類別的型別參數：

```java
public class Base<@NotNull T> {}
```

當繼承自 `Base` 時，Kotlin 期望一個非空型別引數或型別參數。
因此，以下 Kotlin 程式碼會產生警告：

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

您可以透過指定上限 `K : Any` 來修正它。

Kotlin 也支援 Java 型別參數界限上的空值性註解。讓我們為 `Base` 新增界限：

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin 將其翻譯如下：

```kotlin
class BaseWithBound<T : Number> {}
```

因此，將可空型別作為型別引數或型別參數傳遞會產生警告。

註解型別引數和型別參數適用於 Java 8 或更高版本。此功能要求空值性註解支援 `TYPE_USE` 目標（`org.jetbrains.annotations` 在版本 15 及更高版本中支援此目標）。

> 如果空值性註解除了 `TYPE_USE` 目標之外，還支援適用於型別的其他目標，則 `TYPE_USE` 具有優先權。例如，如果 `@Nullable` 同時具有 `TYPE_USE` 和 `METHOD` 目標，則 Java 方法簽章 `@Nullable String[] f()` 在 Kotlin 中變為 `fun f(): Array<String?>!`。
>
{style="note"}

### JSR-305 支援

[JSR-305](https://jcp.org/en/jsr/detail?id=305) 中定義的 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 註解支援用於表示 Java 類型的空值性。

如果 `@Nonnull(when = ...)` 值為 `When.ALWAYS`，則被註解的類型被視為不可空；`When.MAYBE` 和 `When.NEVER` 表示可空類型；而 `When.UNKNOWN` 強制類型為[平台類型](#null-safety-and-platform-types)。

函式庫可以針對 JSR-305 註解進行編譯，但函式庫消費者無需將註解 artifact（例如 `jsr305.jar`）作為編譯依賴。Kotlin 編譯器可以在 classpath 上沒有註解的情況下，從函式庫讀取 JSR-305 註解。

也支援 [自訂空值性限定詞 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md)（見下方）。

#### 類型限定詞暱稱

如果註解類型同時被 [`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
和 JSR-305 `@Nonnull`（或其另一個暱稱，例如 `@CheckForNull`）註解，則該註解類型本身用於檢索精確的空值性，並具有與該空值性註解相同的意義：

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

#### 類型限定詞預設值

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
允許引入註解，當應用時，這些註解在被註解元素的範圍內定義預設空值性。

此類註解類型本身應同時被 `@Nonnull`（或其暱稱）和 `@TypeQualifierDefault(...)` 註解，並帶有一個或多個 `ElementType` 值：

* `ElementType.METHOD` 用於方法的回傳型別
* `ElementType.PARAMETER` 用於值參數
* `ElementType.FIELD` 用於欄位
* `ElementType.TYPE_USE` 用於任何型別，包括型別引數、型別參數的上限和萬用字元型別

當型別本身未被空值性註解註解時，將使用預設空值性，且預設值由最內層包含元素（該元素帶有與型別使用匹配的 `ElementType` 的類型限定詞預設註解）確定。

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

> 本範例中的類型僅在啟用嚴格模式時才生效；否則，平台類型保持不變。
> 請參閱 [`@UnderMigration` 註解](#undermigration-annotation) 和 [編譯器配置](#compiler-configuration) 部分。
>
{style="note"}

也支援套件級別的預設空值性：

```java
// FILE: test/package-info.java
@NonNullApi // declaring all types in package 'test' as non-nullable by default
package test;
```

#### @UnderMigration 註解

`@UnderMigration` 註解（在單獨的 artifact `kotlin-annotations-jvm` 中提供）可供函式庫維護者用於定義空值性類型限定詞的遷移狀態。

`@UnderMigration(status = ...)` 中的狀態值指定編譯器如何處理 Kotlin 中被註解類型的不當使用（例如，將被 `@MyNullable` 註解的類型值用作非空）：

* `MigrationStatus.STRICT` 使註解像任何普通空值性註解一樣工作，即報告不當使用的錯誤並影響被註解宣告中在 Kotlin 中所見的類型
* `MigrationStatus.WARN`：不當使用報告為編譯警告而非錯誤，但被註解宣告中的類型保持平台類型
* `MigrationStatus.IGNORE` 使編譯器完全忽略空值性註解

函式庫維護者可以將 `@UnderMigration` 狀態新增到類型限定詞暱稱和類型限定詞預設值：

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

> 空值性註解的遷移狀態不會被其類型限定詞暱稱繼承，但會應用於其在預設類型限定詞中的使用。
>
{style="note"}

如果預設類型限定詞使用類型限定詞暱稱並且它們都是 `@UnderMigration`，則使用預設類型限定詞的狀態。

#### 編譯器配置

JSR-305 檢查可以透過新增 `-Xjsr305` 編譯器標誌並帶有以下選項（及其組合）進行配置：

* `-Xjsr305={strict|warn|ignore}` 設定非 `@UnderMigration` 註解的行為。自訂空值性限定詞，尤其是
`@TypeQualifierDefault`，已廣泛分佈於許多知名函式庫中，使用者在更新到包含 JSR-305 支援的 Kotlin 版本時可能需要平穩遷移。自 Kotlin 1.1.60 以來，此標誌僅影響非 `@UnderMigration` 註解。

* `-Xjsr305=under-migration:{strict|warn|ignore}` 覆寫 `@UnderMigration` 註解的行為。
使用者對於函式庫的遷移狀態可能有不同的看法：
他們可能希望在官方遷移狀態為 `WARN` 時出現錯誤，反之亦然，
他們可能希望推遲某些錯誤報告，直到他們完成遷移。

* `-Xjsr305=@<fq.name>:{strict|warn|ignore}` 覆寫單一註解的行為，其中 `<fq.name>`
是註解的完全合格類別名稱。可能針對不同的註解出現多次。這對於管理特定函式庫的遷移狀態很有用。

`strict`、`warn` 和 `ignore` 值與 `MigrationStatus` 的意義相同，
並且只有 `strict` 模式會影響被註解宣告中在 Kotlin 中所見的類型。

> 注意：內建的 JSR-305 註解 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
>[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 和
>[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) 始終啟用，並且
>無論編譯器是否使用 `-Xjsr305` 標誌配置，它們都會影響被註解宣告的類型。
>
{style="note"}

例如，將 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` 新增到
編譯器參數中，會使編譯器對 `@org.library.MyNullable` 註解類型的不當使用產生警告，並忽略所有其他 JSR-305 註解。

預設行為與 `-Xjsr305=warn` 相同。`strict` 值應被視為實驗性（未來可能會新增更多檢查）。

## 映射類型

Kotlin 會特別處理某些 Java 類型。這些類型不會「原樣」從 Java 載入，而是*映射*到對應的 Kotlin 類型。
映射僅在編譯時重要，執行時表示保持不變。
Java 的原始類型會映射到對應的 Kotlin 類型（考慮到[平台類型](#null-safety-and-platform-types)）：

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

Java 的封裝原始類型會映射到可空的 Kotlin 類型：

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

請注意，作為型別參數使用的封裝原始類型會映射到平台類型：
例如，`List<java.lang.Integer>` 在 Kotlin 中變為 `List<Int!>`。

集合類型在 Kotlin 中可以是唯讀或可變的，因此 Java 的集合映射如下
（此表格中的所有 Kotlin 類型都位於 `kotlin.collections` 套件中）：

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

Java 的陣列映射如下[下方](#java-arrays)所述：

| **Java 類型** | **Kotlin 類型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |

> 這些 Java 類型的靜態成員無法直接在 Kotlin 類型的[伴隨物件](object-declarations.md#companion-objects)上存取。若要呼叫它們，請使用 Java 類型的完全合格名稱，例如 `java.lang.Integer.toHexString(foo)`。
>
{style="note"}

## Kotlin 中的 Java 泛型

Kotlin 的泛型與 Java 的有些許不同（參閱[泛型](generics.md)）。
當將 Java 類型匯入 Kotlin 時，會進行以下轉換：

* Java 的萬用字元會轉換為型別投射：
  * `Foo<? extends Bar>` 變成 `Foo<out Bar!>!`
  * `Foo<? super Bar>` 變成 `Foo<in Bar!>!`

* Java 的原始類型會轉換為星號投射：
  * `List` 變成 `List<*>!`，即 `List<out Any?>!`

如同 Java 泛型，Kotlin 的泛型在執行時也不會保留：物件不攜帶傳遞給其建構子的實際型別引數資訊。例如，`ArrayList<Integer>()` 與 `ArrayList<Character>()` 無法區分。
這使得進行考慮泛型的 `is` 檢查變得不可能。
Kotlin 只允許對星號投射的泛型類型進行 `is` 檢查：

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java 陣列

Kotlin 中的陣列是不可變的，這與 Java 不同。這表示 Kotlin 不會讓您將 `Array<String>` 指派給 `Array<Any>`，這可以防止可能的執行時失敗。將子類別的陣列作為父類別的陣列傳遞給 Kotlin 方法也是被禁止的，但對於 Java 方法，這可以透過形式為 `Array<(out) String>!` 的[平台類型](#null-safety-and-platform-types)來允許。

陣列在 Java 平台上與原始資料類型一起使用，以避免封裝/解封裝操作的成本。
由於 Kotlin 隱藏了這些實作細節，因此需要變通方法來與 Java 程式碼介面。
對於每種原始陣列類型（`IntArray`、`DoubleArray`、`CharArray` 等）都有專門的類別來處理此情況。
它們與 `Array` 類別無關，並編譯成 Java 的原始陣列以實現最大效能。

假設有一個 Java 方法接受一個 `int` 索引陣列：

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

要在 Kotlin 中傳遞原始值陣列，您可以這樣做：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

在編譯為 JVM 位元組碼時，編譯器會優化對陣列的存取，因此不會引入任何額外開銷：

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // no actual calls to get() and set() generated
for (x in array) { // no iterator created
    print(x)
}
```

即使您透過索引導航，也不會引入任何額外開銷：

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

## Java 變長參數

Java 類別有時會使用帶有可變參數 (varargs) 的索引方法宣告：

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

由於 Java 無法標記那些適用於運算子語法的方法，Kotlin 允許使用任何具有正確名稱和簽章的 Java 方法作為運算子多載和其他慣例（例如 `invoke()` 等）。
不允許使用中綴呼叫語法呼叫 Java 方法。

## 已檢查例外

在 Kotlin 中，所有[例外都是未檢查的](exceptions.md)，這表示編譯器不會強制您捕捉任何例外。
因此，當您呼叫宣告了已檢查例外的 Java 方法時，Kotlin 不會強制您做任何事情：

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java would require us to catch IOException here
    }
}
```

## 物件方法

當 Java 類型匯入 Kotlin 時，所有 `java.lang.Object` 類型的參考都會轉換為 `Any`。
由於 `Any` 不是平台特定的，它只宣告 `toString()`、`hashCode()` 和 `equals()` 作為其成員，
因此為了使 `java.lang.Object` 的其他成員可用，Kotlin 使用了[擴充函數](extensions.md)。

### `wait()` 和 `notify()`

`wait()` 和 `notify()` 方法在 `Any` 類型的參考上不可用。通常不鼓勵使用它們，而偏好使用 `java.util.concurrent`。

如果您確實需要呼叫這些方法，可以透過 Java 物件存取它們，並抑制 `PLATFORM_CLASS_MAPPED_TO_KOTLIN` 警告：

```kotlin
import java.util.LinkedList

class SimpleBlockingQueue<T>(private val capacity: Int) {
    private val queue = LinkedList<T>()

    // java.lang.Object is used specifically to access wait() and notify()
    // In Kotlin, the standard 'Any' type does not expose these methods.
    @Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
    private val lock = Object()

    fun put(item: T) {
        synchronized(lock) {
            while (queue.size >= capacity) {
                lock.wait()
            }
            queue.add(item)
            println("Produced: $item")

            lock.notifyAll()
        }
    }

    fun take(): T {
        synchronized(lock) {
            while (queue.isEmpty()) {
                lock.wait()
            }
            val item = queue.removeFirst()
            println("Consumed: $item")

            lock.notifyAll()
            return item
        }
    }
}
```

或者明確地強制轉換為 `java.lang.Object` 並抑制 `PLATFORM_CLASS_MAPPED_TO_KOTLIN` 警告：

```kotlin
@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
(foo as java.lang.Object).wait()
```

### `getClass()`

要擷取物件的 Java 類別，請在[類別參考](reflection.md#class-references)上使用 `java` 擴充屬性：

```kotlin
val fooClass = foo::class.java
```

上面的程式碼使用[綁定類別參考](reflection.md#bound-class-references)。您也可以使用 `javaClass` 擴充屬性：

```kotlin
val fooClass = foo.javaClass
```

### `clone()`

要覆寫 `clone()`，您的類別需要擴充 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

不要忘記 [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html) 中的第 13 條：*謹慎地覆寫 clone*。

### `finalize()`

要覆寫 `finalize()`，您只需宣告它，而無需使用 `override` 關鍵字：

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
    }
}
```

根據 Java 的規則，`finalize()` 不得為 `private`。

## 繼承自 Java 類別

在 Kotlin 中，一個類別最多可以有一個 Java 類別作為超類型（以及任意數量的 Java 介面）。

## 存取靜態成員

Java 類別的靜態成員會形成這些類別的「伴隨物件」。您無法將此類「伴隨物件」作為值傳遞，但可以明確地存取其成員，例如：

```kotlin
if (Character.isLetter(a)) { ... }
```

要存取[映射](#mapped-types)到 Kotlin 類型的 Java 類型的靜態成員，請使用 Java 類型的完全合格名稱：`java.lang.Integer.bitCount(foo)`。

## Java 反射

Java 反射在 Kotlin 類別上有效，反之亦然。如上所述，您可以使用 `instance::class.java`、`ClassName::class.java` 或 `instance.javaClass` 透過 `java.lang.Class` 進入 Java 反射。
請勿將 `ClassName.javaClass` 用於此目的，因為它指的是 `ClassName` 的伴隨物件類別，
這與 `ClassName.Companion::class.java` 相同，而非 `ClassName::class.java`。

對於每個原始類型，有兩個不同的 Java 類別，Kotlin 提供了兩種獲取方式。例如，`Int::class.java` 將回傳代表原始類型本身的類別實例，
對應於 Java 中的 `Integer.TYPE`。要獲取對應封裝器類型的類別，請使用
`Int::class.javaObjectType`，這等同於 Java 的 `Integer.class`。

其他支援的案例包括獲取 Kotlin 屬性的 Java getter/setter 方法或支援欄位，Java 欄位的 `KProperty`，Java 方法或建構子的 `KFunction`，反之亦然。

## SAM 轉換

Kotlin 支援 Java 和 [Kotlin 介面](fun-interfaces.md)的 SAM 轉換。
對 Java 的這種支援意味著 Kotlin 函數字面值可以自動轉換為單一非預設方法的 Java 介面實作，只要介面方法的參數類型與 Kotlin 函數的參數類型匹配。

您可以將其用於建立 SAM 介面實例：

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...以及在方法呼叫中：

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果 Java 類別有多個接受函數式介面的方法，您可以透過使用轉接器函數來選擇需要呼叫的方法，該函數將 lambda 轉換為特定的 SAM 類型。這些轉接器函數也會在需要時由編譯器生成：

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM 轉換僅適用於介面，不適用於抽象類別，即使這些抽象類別也只有一個抽象方法。
>
{style="note"}

## 在 Kotlin 中使用 JNI

要宣告一個在原生 (C 或 C++) 程式碼中實作的函數，您需要使用 `external` 修飾符標記它：

```kotlin
external fun foo(x: Int): Double
```

其餘程序與 Java 中完全相同。

您也可以將屬性 getter 和 setter 標記為 `external`：

```kotlin
var myProperty: String
    external get
    external set
```

在幕後，這將建立兩個函數 `getMyProperty` 和 `setMyProperty`，兩者都標記為 `external`。

## 在 Kotlin 中使用 Lombok 生成的宣告

您可以在 Kotlin 程式碼中使用 Java 的 Lombok 生成宣告。
如果您需要在同一個混合 Java/Kotlin 模組中生成並使用這些宣告，
您可以從 [Lombok 編譯器外掛頁面](lombok.md)了解如何執行此操作。
如果您從另一個模組呼叫此類宣告，則無需使用此外掛來編譯該模組。
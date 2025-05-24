---
title: "文件化 Kotlin 程式碼：KDoc"
---
用於記錄 Kotlin 程式碼的語言（相當於 Java 的 Javadoc）稱為 **KDoc**。 本質上，KDoc 結合了 Javadoc 的區塊標籤語法（擴展為支援 Kotlin 的特定結構）和 Markdown 的行內標記。

:::note
Kotlin 的文件引擎：Dokka，可以理解 KDoc，並可用於生成各種格式的文件。 欲瞭解更多資訊，請閱讀我們的 [Dokka 文件](dokka-introduction)。

:::

## KDoc 語法

就像 Javadoc 一樣，KDoc 註解以 `/**` 開頭，以 `*/` 結尾。 註解的每一行都可以星號開頭，但不被視為註解內容的一部分。

依照慣例，文件文字的第一段（到第一個空白行為止的文字區塊）是元素的摘要描述，後面的文字是詳細描述。

每個區塊標籤都從新的一行開始，並以 `@` 字元開頭。

以下是使用 KDoc 記錄的類別範例：

```kotlin
/**
 * 一組*成員*。
 *
 * 這個類別沒有有用的邏輯；它只是一個文件範例。
 *
 * @param T 這個群組中成員的型別。
 * @property name 這個群組的名稱。
 * @constructor 建立一個空群組。
 */
class Group<T>(val name: String) {
    /**
     * 將 [member] 新增到此群組。
     * @return 這個群組的新大小。
     */
    fun add(member: T): Int { ... }
}
```

### 區塊標籤 (Block tags)

KDoc 目前支援下列區塊標籤：

### @param _name_

記錄函數的值參數或類別、屬性或函數的型別參數。 為了更好地區分參數名稱和描述，如果您願意，可以用方括號括住參數名稱。 因此，以下兩種語法是等效的：

```none
@param name description.
@param[name] description.
```

### @return

記錄函數的傳回值。

### @constructor

記錄類別的主建構子 (primary constructor)。

### @receiver

記錄擴充函數的接收者 (receiver)。

### @property _name_

記錄具有指定名稱的類別的屬性。 這個標籤可用於記錄在主建構子中宣告的屬性，在這種情況下，直接在屬性定義之前放置文件註解會很尷尬。

### @throws _class_, @exception _class_

記錄一個方法可能拋出的異常。 由於 Kotlin 沒有受檢異常 (checked exceptions)，因此也沒有期望記錄所有可能的異常，但是當它為類別的使用者提供有用的資訊時，您仍然可以使用這個標籤。

### @sample _identifier_

將具有指定完整名稱的函數主體嵌入到目前元素的文件中，以顯示如何使用該元素的範例。

### @see _identifier_

將指定類別或方法的連結新增到文件的 **See also** 區塊。

### @author

指定被記錄元素 (element) 的作者。

### @since

指定引入被記錄元素的軟體版本。

### @suppress

從產生的文件中排除該元素。 可用於不屬於模組的官方 API 但仍然必須在外部可見的元素。

:::note
KDoc 不支援 `@deprecated` 標籤。 請改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 註解。

:::

## 行內標記 (Inline markup)

對於行內標記，KDoc 使用常規的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 語法，並進行擴展以支援連結到程式碼中其他元素的簡寫語法。

### 元素連結 (Links to elements)

要連結到另一個元素（類別、方法、屬性或參數），只需將其名稱放在方括號中：

```none
Use the method [foo] for this purpose.
```

如果要為連結指定自訂標籤，請在元素連結之前將其新增到另一組方括號中：

```none
Use [this method][foo] for this purpose.
```

您也可以在元素連結中使用完整名稱 (qualified names)。 請注意，與 Javadoc 不同，完整名稱始終使用點字元來分隔元件，即使在方法名稱之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素連結中的名稱解析使用與在被記錄元素內部使用名稱時相同的規則。 特別是，這意味著如果您已將名稱匯入到目前檔案中，則在 KDoc 註解中使用它時，您無需完全限定它。

請注意，KDoc 沒有任何用於解析連結中重載成員的語法。 由於 Kotlin 的文件生成工具將函數的所有重載的文件放在同一頁面上，因此不需要識別特定的重載函數才能使連結正常工作。

### 外部連結 (External links)

要新增外部連結，請使用典型的 Markdown 語法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 接下來做什麼？

瞭解如何使用 Kotlin 的文件生成工具：[Dokka](dokka-introduction)。
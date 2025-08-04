[//]: # (title: 文件化 Kotlin 程式碼：KDoc)

用於文件化 Kotlin 程式碼的語言（等同於 Java 的 Javadoc）稱為 **KDoc**。本質上，KDoc
結合了 Javadoc 的區塊標籤語法（並擴展以支援 Kotlin 特定的建構）與 Markdown 的
行內標記功能。

> Kotlin 的文件引擎：Dokka，能夠理解 KDoc 並可用於產生各種格式的文件。
> 如需更多資訊，請閱讀我們的 [Dokka 文件](dokka-introduction.md)。
>
{style="note"}

## KDoc 語法

如同 Javadoc，KDoc 註解以 `/**` 開頭並以 `*/` 結尾。註解的每一行都可以星號開頭，此星號不被視為註解內容的一部分。

依照慣例，文件文字的第一段（直到第一個空白行為止的文字區塊）是元素的摘要說明，後續文字則是詳細說明。

每個區塊標籤都從新的一行開始，並以 `@` 字元開頭。

以下是使用 KDoc 文件化類別的範例：

```kotlin
/**
 * 一群 *成員*。
 *
 * 此類別沒有實用邏輯；它只是一個文件範例。
 *
 * @param T 此群組中成員的類型。
 * @property name 此群組的名稱。
 * @constructor 建立一個空的群組。
 */
class Group<T>(val name: String) {
    /**
     * 將一個 [member] 加入此群組。
     * @return 群組的新大小。
     */
    fun add(member: T): Int { ... }
}
```

### 區塊標籤

KDoc 目前支援以下區塊標籤：

### @param _name_

文件化函式的值參數，或類別、屬性或函式的類型參數。
為了更好地將參數名稱與說明分開，如果您願意，可以將參數名稱括在方括號中。因此，以下兩種語法是等效的：

```none
@param name 說明。
@param[name] 說明。
```

### @return

文件化函式的回傳值。

### @constructor

文件化類別的主要建構函式。

### @receiver

文件化擴充函式的接收者。

### @property _name_

文件化具有指定名稱的類別屬性。此標籤可用於文件化在主要建構函式中宣告的屬性，在這種情況下，將文件註解直接放在屬性定義之前會顯得尷尬。

### @throws _class_、@exception _class_

文件化方法可能拋出的例外。由於 Kotlin 沒有檢查型例外 (checked exceptions)，因此也不期望所有可能的例外都經過文件化，但您仍可以在此標籤為類別使用者提供有用資訊時使用它。

### @sample _identifier_

將指定限定名稱的函式主體嵌入目前元素的文件中，以展示該元素的使用範例。

### @see _identifier_

在文件的「**另請參閱**」區塊中新增一個指向指定類別或方法的連結。

### @author

指定被文件化元素的作者。

### @since

指定引入被文件化元素的軟體版本。

### @suppress

將元素從產生的文件中排除。可用於不屬於模組官方 API 但仍須對外部可見的元素。

> KDoc 不支援 `@deprecated` 標籤。請改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 註解。
>
{style="note"}

## 行內標記

對於行內標記，KDoc 使用常規的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 語法，並擴展以支援連結到程式碼中其他元素的簡寫語法。

### 連結到元素

要連結到另一個元素（類別、方法、屬性或參數），只需將其名稱放在方括號中：

```none
為此目的使用方法 [foo]。
```

如果您想為連結指定自訂標籤，請在元素連結前方的另一組方括號中新增：

```none
為此目的使用 [此方法][foo]。
```

您也可以在元素連結中使用限定名稱。請注意，與 Javadoc 不同，限定名稱始終使用點字符來分隔組件，即使在方法名稱之前也是如此：

```none
使用 [kotlin.reflect.KClass.properties] 來列舉類別的屬性。
```

元素連結中的名稱解析規則，與該名稱在被文件化的元素內部使用時的規則相同。
特別是，這意味著如果您已將名稱匯入目前的檔案，則在 KDoc 註解中使用它時不需要完全限定它。

請注意，KDoc 沒有任何語法來解析連結中的多載成員。由於 Kotlin 的文件產生工具將函式所有多載的文件放在同一頁上，因此識別特定多載函式對於連結的運作並非必需。

### 外部連結

要新增外部連結，請使用典型的 Markdown 語法：

```none
有關 KDoc 語法的更多資訊，請參閱 [KDoc](<example-URL>)。
```

## 接下來？

學習如何使用 Kotlin 的文件產生工具：[Dokka](dokka-introduction.md)。
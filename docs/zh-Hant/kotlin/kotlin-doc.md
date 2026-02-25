[//]: # (title: 為 Kotlin 程式碼編寫文件：KDoc)

用於為 Kotlin 程式碼編寫文件（相當於 Java 的 Javadoc）的語言稱為 **KDoc**。在本質上，KDoc 結合了 Javadoc 的區塊標籤語法（經擴充以支援 Kotlin 的特定結構）以及用於內嵌標記的 Markdown。

> Kotlin 的文件引擎：Dokka，能夠理解 KDoc 並可用於產生各種格式的文件。
> 若要了解更多，請參閱我們的 [Dokka 文件](dokka-introduction.md)。
>
{style="note"}

## KDoc 語法

就像 Javadoc 一樣，KDoc 註解以 `/**` 開頭並以 `*/` 結尾。註解的每一行都可以以星號開頭，這不會被視為註解內容的一部分。

按照慣例，文件文本的第一段（到第一個空白行之前的文字區塊）是該元素的概要描述，隨後的文本則是詳細描述。

每個區塊標籤都從新的一行開始，並以 `@` 字元開頭。

以下是一個使用 KDoc 編寫文件的類別範例：

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic; it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

### 區塊標籤

KDoc 目前支援以下區塊標籤：

### @param _name_

記載函式的數值參數或類別、屬性、函式的型別參數。為了更好地將參數名稱與描述分隔，如果您偏好，可以將參數名稱包裹在方括號中。因此，以下兩種語法是等效的：

```none
@param name description.
@param[name] description.
```

### @return

記載函式的傳回值。

### @constructor

記載類別的主建構函數。

### @receiver

記載擴充函式的接收者。

### @property _name_

記載具有指定名稱的類別屬性。此標籤可用於記載在主建構函數中宣告的屬性，因為在這種情況下，直接在屬性定義前放置文件註解會顯得很彆扭。

### @throws _class_, @exception _class_

記載方法可能拋出的例外。由於 Kotlin 沒有受檢例外，因此也不要求記載所有可能的例外，但當它能為類別的使用者提供有用資訊時，您仍然可以使用此標籤。

### @sample _identifier_

將具有指定合格名稱的函式主體嵌入到目前元素的文件中，以展示該元素的使用範例。

### @see _identifier_

在文件的 **See also** 區塊中加入指向指定類別或方法的連結。

### @author

指定所記載元素的作者。

### @since

指定引入所記載元素的軟體版本。

### @suppress

從產生的文件中排除該元素。可用於那些不屬於模組官方 API 但仍必須對外可見的元素。

> KDoc 不支援 `@deprecated` 標籤。請改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 註解。
>
{style="note"}

## 內嵌標記

對於內嵌標記，KDoc 使用一般的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 語法，並經過擴充以支援連結到程式碼中其他元素的簡寫語法。

### 連結到元素

要連結到另一個元素（類別、方法、屬性或參數），只需將其名稱放在方括號中：

```none
Use the method [foo] for this purpose.
```

如果您想為連結指定自訂標籤，請在元素連結前的另一組方括號中加入該標籤：

```none
Use [this method][foo] for this purpose.
```

您也可以在元素連結中使用合格名稱。請注意，與 Javadoc 不同，合格名稱一律使用點字元來分隔元件，即使是在方法名稱之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素連結中的名稱解析規則與在所記載元素內部使用該名稱的規則相同。特別是，這意味著如果您已將某個名稱匯入到目前檔案中，則在 KDoc 註解中使用它時不需要寫出完整名稱。

請注意，KDoc 沒有任何用於在連結中解析多載成員的語法。由於 Kotlin 的文件產生工具會將函式所有多載的文件放在同一個頁面上，因此連結不需要識別特定的多載函式即可運作。

### 外部連結

要加入外部連結，請使用典型的 Markdown 語法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 後續步驟

了解如何使用 Kotlin 的文件產生工具：[Dokka](dokka-introduction.md)。
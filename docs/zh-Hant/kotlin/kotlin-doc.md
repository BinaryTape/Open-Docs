[//]: # (title: 文件化 Kotlin 程式碼：KDoc)

用於文件化 Kotlin 程式碼的語言 (相當於 Java 的 Javadoc) 稱為 **KDoc**。本質上，KDoc 結合了 Javadoc 的區塊標籤 (block tags) 語法 (已擴展以支援 Kotlin 的特定結構) 和 Markdown 用於內聯標記 (inline markup)。

> Kotlin 的文件產生引擎 Dokka 能理解 KDoc，並可用於產生各種格式的文件。
> 如需更多資訊，請閱讀我們的 [Dokka 文件](dokka-introduction.md)。
>
{style="note"}

## KDoc 語法

和 Javadoc 一樣，KDoc 註解以 `/**` 開頭並以 `*/` 結尾。註解的每一行都可以以星號開頭，該星號不被視為註解內容的一部分。

按照慣例，文件文字的第一段 (指到第一個空行為止的文字區塊) 是對該元素的摘要描述，後續文字則是詳細描述。

每個區塊標籤 (block tag) 都會在新的一行開始，並以 `@` 字符開頭。

這是一個使用 KDoc 文件化的類別範例：

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

### 區塊標籤 (Block tags)

KDoc 目前支援以下區塊標籤：

### @param _name_

文件化函數的值參數，或類別、屬性或函數的型別參數。
為了更好地將參數名稱與描述分開，如果您願意，可以將參數名稱用方括號括起來。因此，以下兩種語法是等效的：

```none
@param name description.
@param[name] description.
```

### @return

文件化函數的回傳值。

### @constructor

文件化類別的主建構函式。

### @receiver

文件化擴展函數的接收者。

### @property _name_

文件化具有指定名稱的類別屬性。此標籤可用於文件化在主建構函式中宣告的屬性，在這種情況下，將文件註解直接放在屬性定義之前會顯得彆扭。

### @throws _class_, @exception _class_

文件化方法可能拋出的例外。由於 Kotlin 沒有檢查型例外 (checked exceptions)，也沒有預期所有可能的例外都會被文件化，但當它能為類別使用者提供有用資訊時，您仍然可以使用此標籤。

### @sample _identifier_

將具有指定限定名稱 (qualified name) 的函數主體嵌入到目前元素的文件中，以顯示該元素如何被使用的範例。

### @see _identifier_

將指定類別或方法的連結加入到文件的 **參閱 (See also)** 區塊中。

### @author

指定被文件化元素的作者。

### @since

指定引入被文件化元素的軟體版本。

### @suppress

將元素從產生的文件中排除。可用於不屬於模組官方 API 但仍需外部可見的元素。

> KDoc 不支援 `@deprecated` 標籤。請改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-Deprecated/) 註解 (annotation)。
>
{style="note"}

## 內聯標記 (Inline markup)

對於內聯標記，KDoc 使用常規的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 語法，該語法已擴展以支援連結到程式碼中其他元素的簡寫語法。

### 元素連結

若要連結到另一個元素 (類別、方法、屬性或參數)，只需將其名稱放在方括號中：

```none
Use the method [foo] for this purpose.
```

如果您想為連結指定自訂標籤，請將其添加到元素連結前的另一對方括號中：

```none
Use [this method][foo] for this purpose.
```

您也可以在元素連結中使用限定名稱。請注意，與 Javadoc 不同，限定名稱總是使用點字符來分隔組件 (components)，即使在方法名稱之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素連結中的名稱解析規則與該名稱用於被文件化元素內部時的規則相同。特別是，這表示如果您已將某個名稱導入到目前檔案中，在 KDoc 註解中使用該名稱時，您無需完全限定它。

請注意，KDoc 沒有任何用於解析連結中重載成員 (overloaded members) 的語法。由於 Kotlin 的文件產生工具將函數所有重載的說明文件放在同一頁面，因此不需要識別特定的重載函數即可使連結生效。

### 外部連結

若要新增外部連結，請使用典型的 Markdown 語法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 下一步？

學習如何使用 Kotlin 的文件產生工具：[Dokka](dokka-introduction.md)。
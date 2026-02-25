[//]: # (title: JS 普通物件編譯器外掛程式)

<primary-label ref="experimental-general"/>

JavaScript (JS) 普通物件編譯器外掛程式 (`js-plain-objects`) 讓您能夠以型別安全的方式建立與複製普通 JS 物件。

在此您可以找到關於普通 JS 物件的資訊，以及如何在您的 Kotlin/JS 專案中使用 `js-plain-objects` 編譯器外掛程式。

> `js-plain-objects` 外掛程式僅適用於新的 K2 Kotlin 編譯器。
>
{style="warning"}

## 普通 JS 物件

普通物件是透過物件常值 (`{}`) 建立的簡單 JS 物件，其中包含資料屬性。
許多 JS API 接受或傳回普通 JS 物件，用於配置或資料交換。

透過 `js-plain-objects` 外掛程式，您可以宣告一個 Kotlin external 介面來描述物件形狀，並標註 `@JsPlainObject`。
編譯器隨後會產生便利的函式來建立與複製此類物件，同時保留 Kotlin 的型別安全性。

## 啟用外掛程式

將 `js-plain-objects` 外掛程式新增至專案的 Gradle 配置檔案，如下方的 Kotlin DSL 所示：

<tabs group="js-plain-objects">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.js-plain-objects") version "%kotlinVersion%"
}

kotlin {
    js {
        browser() // 或 nodejs()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.js-plain-objects' version '%kotlinVersion%'
}

kotlin {
    js {
        browser() // 或 nodejs()
    }
}
```

</tab>
</tabs>

## 宣告普通物件型別

啟用 `js-plain-objects` 外掛程式後，即可宣告普通物件型別。
將 external 介面標註為 `@JsPlainObject`。例如：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // 您可以使用可為 null 的型別來將屬性宣告為選填
    val email: String? 
}
```

當外掛程式處理此類介面時，它會產生一個伴隨物件，其中包含兩個用於建立與複製物件的幫助程式函式：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    val email: String?

    // 由外掛程式產生
    @JsExport.Ignore
    companion object {
        inline operator fun invoke(name: String, age: Int, email: String? = NOTHING): User =
            js("({ name: name, age: age, email: email })")

        inline fun copy(source: User, name: String = NOTHING, age: Int = NOTHING, email: String? = NOTHING): User =
            js("Object.assign({}, source, { name: name, age: age, email: email })")
    }
}
```

承接上例：

* `name` 與 `age` 宣告時未標記可為 null 性，因此它們是必填的。
* `email` 被宣告為可為 null，因此它是選填的，可以在建立時省略。
* `invoke` 運算子會根據提供的屬性建置一個新的普通 JS 物件。
* `copy` 函式會透過對 `source` 進行淺層複製並覆寫任何指定的屬性來建立一個新物件。
* 伴隨物件被標記為 `@JsExport.Ignore`，以避免將這些幫助程式洩漏到 JS 匯出中。

## 使用普通物件

使用產生的幫助程式來建立與複製物件：

```kotlin
fun main() {
    val user = User(name = "Name", age = 10)
    val copy = User.copy(user, age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

該 Kotlin 程式碼會編譯為 JavaScript：

```javascript
function main () {
    var user = { name: "Name", age: 10 };
    var copy = Object.assign({}, user, { age: 11, email: "some@user.com" });

    println(JSON.stringify(user));
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy));
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

透過此方法建立的任何 JavaScript 物件都是安全的。當您使用錯誤的屬性名稱或值型別時，將會遇到編譯時期錯誤。此方法也是零成本的，因為產生的程式碼會以簡單的物件常值與 `Object.assign` 呼叫進行內嵌。

## 延伸閱讀

若要進一步了解與 JavaScript 的互通性，請參閱[從 Kotlin 使用 JavaScript 程式碼](js-interop.md)與 [dynamic 型別](dynamic-type.md)文件。
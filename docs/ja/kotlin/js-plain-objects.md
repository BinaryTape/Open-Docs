[//]: # (title: JSプレーンオブジェクトコンパイラプラグイン)

<primary-label ref="experimental-general"/>

JavaScript (JS) プレーンオブジェクトコンパイラプラグイン (`js-plain-objects`) を使用すると、型安全な方法でプレーンなJSオブジェクトの作成とコピーが可能になります。

ここでは、プレーンなJSオブジェクトに関する情報と、Kotlin/JSプロジェクトで `js-plain-objects` コンパイラプラグインを使用する方法について説明します。

> `js-plain-objects` プラグインは、新しいK2 Kotlinコンパイラでのみ動作します。
>
{style="warning"}

## プレーンなJSオブジェクト

プレーンオブジェクトとは、データプロパティを含むオブジェクトリテラル (`{}`) を介して作成されるシンプルなJSオブジェクトのことです。
多くのJS APIは、設定やデータ交換のためにプレーンなJSオブジェクトを受け取ったり返したりします。

`js-plain-objects` プラグインを使用すると、Kotlinの外部インターフェース（external interface）を宣言してオブジェクトの形状を記述し、それに `@JsPlainObject` アノテーションを付加します。
コンパイラは、Kotlinの型安全性を維持しながら、そのようなオブジェクトを構築およびコピーするための便利な関数を生成します。

## プラグインを有効にする

以下のKotlin DSLに示すように、`js-plain-objects` プラグインをプロジェクトのGradle構成ファイルに追加します。

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
        browser() // または nodejs()
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
        browser() // または nodejs()
    }
}
```

</tab>
</tabs>

## プレーンオブジェクト型の宣言

`js-plain-objects` プラグインを有効にすると、プレーンオブジェクト型を宣言できるようになります。
外部インターフェースに `@JsPlainObject` を付加します。例：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // Null許容型を使用して、プロパティをオプションとして宣言できます
    val email: String? 
}
```

プラグインがこのようなインターフェースを処理すると、オブジェクトの作成とコピーのための2つのヘルパー関数を持つコンパニオンオブジェクトが生成されます。

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    val email: String?

    // プラグインによって生成されます
    @JsExport.Ignore
    companion object {
        inline operator fun invoke(name: String, age: Int, email: String? = NOTHING): User =
            js("({ name: name, age: age, email: email })")

        inline fun copy(source: User, name: String = NOTHING, age: Int = NOTHING, email: String? = NOTHING): User =
            js("Object.assign({}, source, { name: name, age: age, email: email })")
    }
}
```

上記の例について：

* `name` と `age` はNull許容マークなしで宣言されているため、必須です。
* `email` はNull許容として宣言されているため、オプションであり、作成時に省略可能です。
* `invoke` 演算子は、指定されたプロパティを使用して新しいプレーンなJSオブジェクトを構築します。
* `copy` 関数は、`source` を浅くコピー（shallow-copy）し、指定されたプロパティを上書きすることで新しいオブジェクトを作成します。
* コンパニオンオブジェクトには `@JsExport.Ignore` が付加されており、これらのヘルパーがJSエクスポートに漏れるのを防ぎます。

## プレーンオブジェクトの使用

生成されたヘルパーを使用して、オブジェクトを作成およびコピーします。

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

このKotlinコードは、以下のJavaScriptにコンパイルされます。

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

このアプローチで作成されたJavaScriptオブジェクトは安全です。誤ったプロパティ名や値の型を使用すると、コンパイルエラーが発生します。また、生成されたコードは単純なオブジェクトリテラルや `Object.assign` の呼び出しとしてインライン化されるため、ゼロコスト（zero-cost）です。

## 次のステップ

JavaScriptとの相互運用性の詳細については、[KotlinからJavaScriptコードを使用する](js-interop.md) および [dynamic 型](dynamic-type.md) のドキュメントを参照してください。
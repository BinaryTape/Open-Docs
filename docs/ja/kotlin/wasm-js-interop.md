[//]: # (title: JavaScriptとの相互運用)

<primary-label ref="beta"/>

Kotlin/Wasmでは、KotlinからJavaScriptコードを、またJavaScriptからKotlinコードを使用できます。

[Kotlin/JS](js-overview.md)と同様に、Kotlin/WasmコンパイラもJavaScriptとの相互運用性を持っています。Kotlin/JSの相互運用性に精通している場合、Kotlin/Wasmの相互運用性も似ていることに気づくでしょう。ただし、考慮すべき重要な違いがいくつかあります。

> Kotlin/Wasmは[ベータ版](components-stability.md)です。これはいつでも変更される可能性があります。本番環境前のシナリオでご使用ください。フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)にて歓迎いたします。
>
{style="note"}

## KotlinでJavaScriptコードを使用する

外部宣言、JavaScriptコードスニペットを持つ関数、および`@JsModule`アノテーションを使用して、KotlinでJavaScriptコードを使用する方法を学びます。

### 外部宣言

外部のJavaScriptコードは、デフォルトではKotlinから見えません。
KotlinでJavaScriptコードを使用するには、そのAPIを`external`宣言で記述できます。

#### JavaScript関数

このJavaScript関数を考えてみましょう。

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

Kotlinでは`external`関数として宣言できます。

```kotlin
external fun greet(name: String)
```

外部関数は本体を持たず、通常のKotlin関数として呼び出すことができます。

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScriptプロパティ

このグローバルなJavaScript変数を考えてみましょう。

```javascript
let globalCounter = 0;
```

Kotlinでは`external`な`var`または`val`プロパティとして宣言できます。

```kotlin
external var globalCounter: Int
```

これらのプロパティは外部で初期化されます。Kotlinコードでは、これらのプロパティに`= value`初期化子を持たせることはできません。

#### JavaScriptクラス

このJavaScriptクラスを考えてみましょう。

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

Kotlinでは外部クラスとして使用できます。

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external`クラス内のすべての宣言は、暗黙的に外部として扱われます。

#### 外部インターフェース

KotlinでJavaScriptオブジェクトの「形状 (shape)」を記述できます。このJavaScript関数とそれが返すものを考えてみましょう。

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

その形状をKotlinで`external interface User`型として記述する方法を見てみましょう。

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部インターフェースは実行時型情報を持たず、コンパイル時のみの概念です。
そのため、外部インターフェースには通常のインターフェースと比較していくつかの制限があります。
*   `is`チェックの右側で使用することはできません。
*   クラスリテラル式 (`User::class`など) で使用することはできません。
*   実体化された型引数として渡すことはできません。
*   `as`による外部インターフェースへのキャストは常に成功します。

#### 外部オブジェクト

オブジェクトを保持するこれらのJavaScript変数を考えてみましょう。

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

Kotlinでは外部オブジェクトとして使用できます。

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部型階層

通常のクラスやインターフェースと同様に、外部宣言は他の外部クラスを拡張したり、外部インターフェースを実装したりするように宣言できます。
ただし、同じ型階層内で外部宣言と非外部宣言を混在させることはできません。

### JavaScriptコードを含むKotlin関数

`= js("code")`という本体を持つ関数を定義することで、JavaScriptスニペットをKotlin/Wasmコードに追加できます。

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

JavaScriptステートメントのブロックを実行したい場合は、文字列内のコードを中括弧`{}`で囲んでください。

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

オブジェクトを返したい場合は、中括弧`{}`を丸括弧`()`で囲んでください。

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasmは`js()`関数の呼び出しを特別な方法で扱い、実装にはいくつかの制限があります。
*   `js()`関数の呼び出しには、文字列リテラル引数を指定する必要があります。
*   `js()`関数の呼び出しは、関数本体の唯一の式でなければなりません。
*   `js()`関数は、パッケージレベルの関数からのみ呼び出すことができます。
*   関数の戻り値の型は明示的に指定する必要があります。
*   [型](#type-correspondence)は、`external fun`と同様に制限されます。

Kotlinコンパイラは、コード文字列を生成されたJavaScriptファイルの関数に入れ、WebAssembly形式でインポートします。
KotlinコンパイラはこれらのJavaScriptスニペットを検証しません。
JavaScriptの構文エラーがある場合、それらはJavaScriptコードを実行するときに報告されます。

> `@JsFun`アノテーションも同様の機能を持っており、おそらく非推奨になります。
>
{style="note"}

### JavaScriptモジュール

デフォルトでは、外部宣言はJavaScriptのグローバルスコープに対応します。Kotlinファイルを[`@JsModule`アノテーション](js-modules.md#jsmodule-annotation)でアノテーションすると、その中のすべての外部宣言は指定されたモジュールからインポートされます。

このJavaScriptコードサンプルを考えてみましょう。

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

`@JsModule`アノテーションを使用してKotlinでこのJavaScriptコードを使用します。

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 配列の相互運用

JavaScriptの`JsArray<T>`をKotlinのネイティブな`Array`または`List`型にコピーできます。同様に、これらのKotlin型を`JsArray<T>`にコピーできます。

`JsArray<T>`を`Array<T>`に、またはその逆に変換するには、利用可能な[アダプター関数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)のいずれかを使用します。

以下にジェネリック型間の変換の例を示します。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

型付き配列を対応するKotlin型（例：`IntArray`と`Int32Array`）に変換するための同様のアダプター関数が利用可能です。詳細情報と実装については、[`kotlinx-browser`リポジトリ](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)を参照してください。

以下に型付き配列間の変換の例を示します。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## JavaScriptでKotlinコードを使用する

`@JsExport`アノテーションを使用して、JavaScriptでKotlinコードを使用する方法を学びます。

### @JsExportアノテーションを持つ関数

Kotlin/Wasm関数をJavaScriptコードで利用可能にするには、`@JsExport`アノテーションを使用します。

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

`@JsExport`アノテーションが付けられたKotlin/Wasm関数は、生成された`.mjs`モジュールの`default`エクスポートのプロパティとして可視化されます。
その後、JavaScriptでこの関数を使用できます。

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasmコンパイラは、Kotlinコード内の任意の`@JsExport`宣言からTypeScript定義を生成できます。
これらの定義は、IDEやJavaScriptツールによってコードのオートコンプリートを提供し、型チェックを支援し、JavaScriptおよびTypeScriptからKotlinコードをより簡単に利用できるようにするために使用できます。

Kotlin/Wasmコンパイラは、`@JsExport`アノテーションが付けられたトップレベル関数を収集し、`.d.ts`ファイルにTypeScript定義を自動的に生成します。

TypeScript定義を生成するには、`build.gradle.kts`ファイルの`wasmJs{}`ブロックに`generateTypeScriptDefinitions()`関数を追加します。

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

> Kotlin/WasmでのTypeScript宣言ファイルの生成は[実験的](components-stability.md#stability-levels-explained)です。これはいつでも削除または変更される可能性があります。
>
{style="warning"}

## 型の対応関係

Kotlin/Wasmは、JavaScript相互運用宣言のシグネチャで特定の型のみを許可します。
これらの制限は、`external`、`= js("code")`、または`@JsExport`を持つ宣言に一律に適用されます。

Kotlin型がJavaScript型にどのように対応するかを見てみましょう。

| Kotlin                                                     | JavaScript                        |
|:-----------------------------------------------------------|:----------------------------------|
| `Byte`、`Short`、`Int`、`Char`、`UByte`、`UShort`、`UInt` | `Number`                          |
| `Float`、`Double`                                          | `Number`                          |
| `Long`、`ULong`                                            | `BigInt`                          |
| `Boolean`                                                  | `Boolean`                         |
| `String`                                                   | `String`                          |
| 戻り値の位置にある`Unit`                                   | `undefined`                       |
| 関数型、例：`(String) -> Int`                              | Function                          |
| `JsAny`とそのサブタイプ                                   | 任意のJavaScript値                |
| `JsReference`                                              | Kotlinオブジェクトへの不透明な参照 |
| その他の型                                                 | サポートされていません            |

これらの型のnullableバージョンも使用できます。

### JsAny型

JavaScriptの値は、Kotlinでは`JsAny`型とそのサブタイプを使用して表現されます。

Kotlin/Wasm標準ライブラリは、これらの型の一部に対して表現を提供します。
*   パッケージ`kotlin.js`：
    *   `JsAny`
    *   `JsBoolean`、`JsNumber`、`JsString`
    *   `JsArray`
    *   `Promise`

外部インターフェースまたはクラスを宣言することで、カスタムの`JsAny`サブタイプを作成することもできます。

### JsReference型

Kotlinの値は、`JsReference`型を使用して不透明な参照としてJavaScriptに渡すことができます。

たとえば、このKotlinクラス`User`をJavaScriptに公開したい場合：

```kotlin
class User(var name: String)
```

`toJsReference()`関数を使用して`JsReference<User>`を作成し、JavaScriptに返すことができます。

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

これらの参照はJavaScriptでは直接利用できず、空の凍結されたJavaScriptオブジェクトのように振る舞います。
これらのオブジェクトを操作するには、参照値をアンラップする`get()`メソッドを使用して、より多くの関数をJavaScriptにエクスポートする必要があります。

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

JavaScriptからクラスを作成し、その名前を変更することができます。

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 型パラメータ

JavaScript相互運用宣言は、`JsAny`またはそのサブタイプの境界を持つ場合、型パラメータを持つことができます。例：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 例外処理

Kotlinの`try-catch`式を使用してKotlin/WasmコードでJavaScript例外をキャッチできます。例外処理は次のように機能します。

*   JavaScriptからスローされた例外：詳細な情報はKotlin側で利用可能です。このような例外がJavaScriptに伝播する場合、WebAssemblyにラップされることはなくなります。

*   Kotlinからスローされた例外：通常のJSエラーとしてJavaScript側でキャッチできます。

以下に、Kotlin側でJavaScript例外をキャッチする例を示します。

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

この例外処理は、[`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)機能をサポートするモダンブラウザで自動的に機能します：

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

## Kotlin/WasmとKotlin/JSの相互運用性の違い

Kotlin/Wasmの相互運用性はKotlin/JSの相互運用性と類似点がありますが、考慮すべき重要な違いがあります：

|                             | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|:----------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| **外部Enum**                | 外部enumクラスをサポートしていません。                                                                                                                                                                              | 外部enumクラスをサポートしています。                                                                                                                     |
| **型拡張**                  | 非外部型が外部型を拡張することをサポートしていません。                                                                                                                                                        | 非外部型をサポートしています。                                                                                                                        |
| **`JsName`アノテーション**   | 外部宣言にアノテーションを付ける場合にのみ効果があります。                                                                                                                                                           | 通常の非外部宣言の名前を変更するために使用できます。                                                                                   |
| **`js()`関数**              | `js("code")`関数呼び出しは、パッケージレベルの関数の単一の式本体として許可されます。                                                                                                                     | `js("code")`関数は任意のコンテキストで呼び出すことができ、`dynamic`値を返します。                                                               |
| **モジュールシステム**      | ESモジュールのみをサポートします。`@JsNonModule`アノテーションに相当するものはありません。そのエクスポートは`default`オブジェクトのプロパティとして提供されます。パッケージレベルの関数のみをエクスポートできます。 | ESモジュールとレガシーモジュールシステムをサポートします。名前付きESMエクスポートを提供します。クラスとオブジェクトのエクスポートを許可します。                                    |
| **型**                      | `external`、`= js("code")`、`@JsExport`のすべての相互運用宣言に一律に厳格な型制限を適用します。選択された数の[組み込みKotlin型と`JsAny`サブタイプ](#type-correspondence)のみを許可します。 | `external`宣言ではすべての型を許可します。`@JsExport`で使用できる型を[制限します](js-to-kotlin-interop.md#kotlin-types-in-javascript)。 |
| **Long**                    | JavaScriptの`BigInt`に対応する型です。                                                                                                                                                                            | JavaScriptではカスタムクラスとして可視です。                                                                                                            |
| **配列**                    | 相互運用ではまだ直接サポートされていません。代わりに新しい`JsArray`型を使用できます。                                                                                                                                  | JavaScript配列として実装されます。                                                                                                                   |
| **その他の型**              | KotlinオブジェクトをJavaScriptに渡すには`JsReference<>`が必要です。                                                                                                                                                      | 外部宣言で非外部Kotlinクラス型を使用できます。                                                                                                        |
| **例外処理**                | `JsException`および`Throwable`型で任意のJavaScript例外をキャッチできます。                                                                                                                                | `Throwable`型を使用してJavaScriptの`Error`をキャッチできます。`dynamic`型を使用して任意のJavaScript例外をキャッチできます。                            |
| **動的型**                  | `dynamic`型はサポートされていません。代わりに`JsAny`を使用してください（以下のサンプルコードを参照）。                                                                                                                                   | `dynamic`型をサポートしています。                                                                                                                   |

> Kotlin/Wasmでは、型なしまたはルーズな型付きオブジェクトとの相互運用性に関するKotlin/JSの[動的型](dynamic-type.md)はサポートされていません。代わりに`dynamic`型の代わりに、`JsAny`型を使用できます。
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
>
{style="note"}

## Web関連のブラウザAPI

[`kotlinx-browser`ライブラリ](https://github.com/Kotlin/kotlinx-browser)は、JavaScriptブラウザAPIを提供するスタンドアロンライブラリです。これには以下が含まれます。
*   パッケージ`org.khronos.webgl`：
    *   `Int8Array`のような型付き配列。
    *   WebGL型。
*   パッケージ`org.w3c.dom.*`：
    *   DOM API型。
*   パッケージ`kotlinx.browser`：
    *   `window`や`document`のようなDOM APIグローバルオブジェクト。

`kotlinx-browser`ライブラリの宣言を使用するには、プロジェクトのビルド構成ファイルに依存関係として追加します。

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
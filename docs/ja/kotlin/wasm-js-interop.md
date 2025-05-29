[//]: # (title: JavaScriptとの相互運用)

Kotlin/Wasmでは、KotlinでJavaScriptコードを使用することも、JavaScriptでKotlinコードを使用することもできます。

[Kotlin/JS](js-overview.md)と同様に、Kotlin/WasmコンパイラもJavaScriptとの相互運用性を持っています。Kotlin/JSの相互運用性に慣れている方なら、Kotlin/Wasmの相互運用性が似ていることに気づくでしょう。ただし、考慮すべき重要な違いがいくつかあります。

> Kotlin/Wasmは[アルファ版](components-stability.md)です。いつでも変更される可能性があります。本番環境前のシナリオで使用してください。皆様からのフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でいただけると幸いです。
>
{style="note"}

## KotlinでJavaScriptコードを使用する

`external`宣言、JavaScriptコードスニペットを含む関数、および`@JsModule`アノテーションを使用して、KotlinでJavaScriptコードを使用する方法を学びます。

### External宣言

外部JavaScriptコードは、デフォルトではKotlinから見えません。KotlinでJavaScriptコードを使用するには、`external`宣言でそのAPIを記述できます。

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

External関数は本体を持たず、通常のKotlin関数として呼び出すことができます。

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScriptプロパティ

このグローバルJavaScript変数を考えてみましょう。

```javascript
let globalCounter = 0;
```

Kotlinでは、外部の`var`または`val`プロパティを使用して宣言できます。

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

`external`クラス内のすべての宣言は、暗黙的に外部と見なされます。

#### Externalインターフェース

KotlinでJavaScriptオブジェクトの形状を記述できます。このJavaScript関数とその戻り値を考えてみましょう。

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

その形状がKotlinで`external interface User`型としてどのように記述できるか見てみましょう。

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

Externalインターフェースは実行時の型情報を持たず、コンパイル時のみの概念です。したがって、通常のインターフェースと比較して、いくつかの制限があります。
* `is`チェックの右辺で使用することはできません。
* クラスリテラル式 (`User::class`など) で使用することはできません。
* 実体化された型引数として渡すことはできません。
* `as`によるexternalインターフェースへのキャストは常に成功します。

#### Externalオブジェクト

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

#### External型階層

通常のクラスやインターフェースと同様に、他の外部クラスを拡張し、外部インターフェースを実装するexternal宣言を宣言できます。ただし、同じ型階層内でexternal宣言と非external宣言を混在させることはできません。

### JavaScriptコードを含むKotlin関数

`= js("code")`を本体に持つ関数を定義することで、JavaScriptスニペットをKotlin/Wasmコードに追加できます。

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

JavaScriptステートメントのブロックを実行したい場合は、文字列内のコードを波括弧`{}`で囲みます。

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

オブジェクトを返したい場合は、波括弧`{}`を括弧`()`で囲みます。

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasmは`js()`関数の呼び出しを特別な方法で処理し、その実装にはいくつかの制限があります。
* `js()`関数の呼び出しには、文字列リテラル引数が必要です。
* `js()`関数の呼び出しは、関数本体内の唯一の式でなければなりません。
* `js()`関数は、パッケージレベルの関数からのみ呼び出すことができます。
* 関数の戻り値の型は明示的に指定する必要があります。
* [型](#type-correspondence)は、`external fun`と同様に制限されます。

Kotlinコンパイラは、コード文字列を生成されたJavaScriptファイル内の関数に配置し、WebAssembly形式にインポートします。KotlinコンパイラはこれらのJavaScriptスニペットを検証しません。JavaScriptの構文エラーがある場合、それらはJavaScriptコードを実行したときに報告されます。

> `@JsFun`アノテーションも同様の機能を持っており、おそらく非推奨になります。
>
{style="note"}

### JavaScriptモジュール

デフォルトでは、external宣言はJavaScriptのグローバルスコープに対応します。Kotlinファイルに[`@JsModule`アノテーション](js-modules.md#jsmodule-annotation)を付加すると、その中のすべてのexternal宣言は指定されたモジュールからインポートされます。

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

このJavaScriptコードをKotlinで`@JsModule`アノテーションと共に使用します。

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

JavaScriptの`JsArray<T>`をKotlinのネイティブな`Array`または`List`型にコピーできます。同様に、これらのKotlin型を`JsArray<T>`にコピーすることもできます。

`JsArray<T>`を`Array<T>`に、またはその逆に変換するには、利用可能な[アダプター関数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)のいずれかを使用します。

ジェネリック型間の変換の例を次に示します。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

型付き配列を対応するKotlin型（例えば、`IntArray`と`Int32Array`）に変換するための同様のアダプター関数が利用可能です。詳細な情報と実装については、[`kotlinx-browser`リポジトリ](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)を参照してください。

型付き配列間の変換の例を次に示します。

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

`@JsExport`アノテーションが付けられたKotlin/Wasm関数は、生成された`.mjs`モジュールの`default`エクスポートのプロパティとして可視化されます。その後、JavaScriptでこの関数を使用できます。

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasmコンパイラは、Kotlinコード内のすべての`@JsExport`宣言からTypeScript定義を生成できます。これらの定義は、IDEやJavaScriptツールでコード補完、型チェックの支援、およびJavaScriptやTypeScriptからKotlinコードを利用しやすくするために使用できます。

Kotlin/Wasmコンパイラは、`@JsExport`アノテーションが付けられたすべてのトップレベル関数を収集し、`.d.ts`ファイルにTypeScript定義を自動的に生成します。

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

> Kotlin/WasmでのTypeScript宣言ファイルの生成は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
>
{style="warning"}

## 型の対応

Kotlin/Wasmでは、JavaScript相互運用宣言のシグネチャで使用できる型が制限されています。これらの制限は、`external`、`= js("code")`、または`@JsExport`を持つ宣言に一律に適用されます。

Kotlinの型がJavaScriptの型にどのように対応するかを見てみましょう。

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| 戻り値の`Unit`                                               | `undefined`                       |
| 関数型（例: `(String) -> Int`）                             | Function                          |
| `JsAny`とサブタイプ                                          | 任意のJavaScript値                  |
| `JsReference`                                              | Kotlinオブジェクトへの不透明な参照    |
| その他の型                                                 | サポートされていません              |

これらの型のnullableバージョンも使用できます。

### JsAny型

JavaScriptの値は、Kotlinでは`JsAny`型とそのサブタイプを使用して表現されます。

Kotlin/Wasm標準ライブラリは、これらの型の一部を表すものを提供しています。
* パッケージ `kotlin.js`:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

`external`インターフェースまたはクラスを宣言することで、カスタムの`JsAny`サブタイプを作成することもできます。

### JsReference型

Kotlinの値は、`JsReference`型を使用して不透明な参照としてJavaScriptに渡すことができます。

例えば、このKotlinクラス`User`をJavaScriptに公開したい場合:

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

これらの参照はJavaScriptでは直接利用できず、空の凍結されたJavaScriptオブジェクトのように振る舞います。これらのオブジェクトを操作するには、`get()`メソッドを使用して参照値をアンラップする関数をJavaScriptにさらにエクスポートする必要があります。

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

JavaScriptからクラスを作成し、その名前を変更できます。

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 型パラメーター

JavaScript相互運用宣言は、`JsAny`またはそのサブタイプの上限を持つ場合に型パラメーターを持つことができます。例:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 例外処理

Kotlinの`try-catch`式を使用してJavaScriptの例外をキャッチできます。ただし、Kotlin/Wasmでは、スローされた値に関する特定の詳細にデフォルトでアクセスすることはできません。

`JsException`型に、元のエラーメッセージとJavaScriptからのスタックトレースを含めるように設定できます。そのためには、`build.gradle.kts`ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

この動作は`WebAssembly.JSTag` APIに依存しており、これは特定のブラウザでのみ利用可能です。

* **Chrome:** バージョン115以降でサポート
* **Firefox:** バージョン129以降でサポート
* **Safari:** まだサポートされていません

この動作を示す例を次に示します。

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

`-Xwasm-attach-js-exception`コンパイラオプションを有効にすると、`JsException`型はJavaScriptエラーからの特定の詳細を提供します。このコンパイラオプションを有効にしない場合、`JsException`は、JavaScriptコードの実行中に例外がスローされたことを示す一般的なメッセージのみを含みます。

JavaScriptの`try-catch`式を使用してKotlin/Wasmの例外をキャッチしようとすると、直接アクセス可能なメッセージやデータのない一般的な`WebAssembly.Exception`のように見えます。

## Kotlin/WasmとKotlin/JSの相互運用の違い

Kotlin/Wasmの相互運用性はKotlin/JSの相互運用性と類似していますが、考慮すべき重要な違いがあります。

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **External enums**      | 外部enumクラスをサポートしていません。                                                                                                                                                                              | 外部enumクラスをサポートしています。                                                                                                                     |
| **Type extensions**     | 外部型を拡張する非外部型をサポートしていません。                                                                                                                                                        | 非外部型をサポートしています。                                                                                                                        |
| **`JsName` annotation** | external宣言にアノテーションを付加した場合にのみ効果があります。                                                                                                                                                           | 通常の非外部宣言の名前を変更するために使用できます。                                                                                   |
| **`js()` function**       | `js("code")`関数呼び出しは、パッケージレベル関数の単一の式本体として許可されます。                                                                                                                     | `js("code")`関数は、任意のコンテキストで呼び出すことができ、`dynamic`値を返します。                                                               |
| **Module systems**      | ESモジュールのみをサポートします。`@JsNonModule`アノテーションに相当するものはありません。そのエクスポートは`default`オブジェクトのプロパティとして提供されます。パッケージレベルの関数のみのエクスポートを許可します。                           | ESモジュールとレガシーモジュールシステムをサポートします。名前付きESMエクスポートを提供します。クラスとオブジェクトのエクスポートを許可します。                                    |
| **Types**               | `external`、`= js("code")`、および`@JsExport`のすべての相互運用宣言に一律に厳格な型制限を適用します。限られた数の[組み込みKotlin型と`JsAny`サブタイプ](#type-correspondence)を許可します。 | `external`宣言内のすべての型を許可します。[`@JsExport`で使用できる型](js-to-kotlin-interop.md#kotlin-types-in-javascript)を制限します。 |
| **Long**                | 型はJavaScriptの`BigInt`に対応します。                                                                                                                                                                            | JavaScriptではカスタムクラスとして可視です。                                                                                                            |
| **Arrays**              | 相互運用ではまだ直接サポートされていません。代わりに新しい`JsArray`型を使用できます。                                                                                                                                  | JavaScript配列として実装されています。                                                                                                                   |
| **Other types**         | KotlinオブジェクトをJavaScriptに渡すには`JsReference<>`が必要です。                                                                                                                                                      | external宣言で非外部Kotlinクラス型を使用できます。                                                                         |
| **Exception handling**  | `JsException`と`Throwable`型で任意のJavaScript例外をキャッチできます。                                                                                                                                | `Throwable`型を使用してJavaScriptの`Error`をキャッチできます。`dynamic`型を使用して任意のJavaScript例外をキャッチできます。                            |
| **Dynamic types**       | `dynamic`型をサポートしていません。代わりに`JsAny`を使用します（以下のサンプルコードを参照）。                                                                                                                                   | `dynamic`型をサポートしています。                                                                                                                        |

> 型なしまたは緩く型付けされたオブジェクトとの相互運用のためのKotlin/JSの[dynamic型](dynamic-type.md)は、Kotlin/Wasmではサポートされていません。`dynamic`型の代わりに、`JsAny`型を使用できます。
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

## Web関連ブラウザAPI

[`kotlinx-browser`ライブラリ](https://github.com/kotlin/kotlinx-browser)は、JavaScriptブラウザAPIを提供するスタンドアロンライブラリで、以下を含みます。
* パッケージ `org.khronos.webgl`:
  * `Int8Array`などの型付き配列。
  * WebGL型。
* パッケージ `org.w3c.dom.*`:
  * DOM API型。
* パッケージ `kotlinx.browser`:
  * `window`や`document`などのDOM APIグローバルオブジェクト。

`kotlinx-browser`ライブラリの宣言を使用するには、プロジェクトのビルド設定ファイルに依存関係として追加します。

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
---
title: JavaScriptとの相互運用性
---
Kotlin/Wasm を使用すると、Kotlin 内で JavaScript コードを使用することも、JavaScript 内で Kotlin コードを使用することもできます。

[Kotlin/JS](js-overview) と同様に、Kotlin/Wasm コンパイラーも JavaScript との相互運用性を持っています。Kotlin/JS の相互運用性についてよくご存じであれば、Kotlin/Wasm の相互運用性も同様であることに気づくでしょう。ただし、考慮すべき重要な違いがあります。

:::note
Kotlin/Wasm は [Alpha](components-stability) 版です。いつでも変更される可能性があります。本番環境で使用する前にシナリオで試してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) でフィードバックをお待ちしております。

:::

## Kotlin で JavaScript コードを使用する

`external` 宣言、JavaScript コードスニペットを含む関数、および `@JsModule` アノテーションを使用して、Kotlin で JavaScript コードを使用する方法を学びます。

### 外部宣言

外部 JavaScript コードは、デフォルトでは Kotlin で表示されません。
Kotlin で JavaScript コードを使用するには、`external` 宣言でその API を記述します。

#### JavaScript 関数

次の JavaScript 関数を考えてみましょう。

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

Kotlin では、これを `external` 関数として宣言できます。

```kotlin
external fun greet(name: String)
```

外部関数は本体を持たず、通常の Kotlin 関数として呼び出すことができます。

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript プロパティ

次のグローバル JavaScript 変数を考えてみましょう。

```javascript
let globalCounter = 0;
```

Kotlin では、外部 `var` または `val` プロパティを使用して宣言できます。

```kotlin
external var globalCounter: Int
```

これらのプロパティは外部で初期化されます。プロパティは Kotlin コードで `= value` 初期化子を持つことができません。

#### JavaScript クラス

次の JavaScript クラスを考えてみましょう。

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

Kotlin では、これを外部クラスとして使用できます。

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` クラス内のすべての宣言は、暗黙的に外部と見なされます。

#### 外部インターフェース

Kotlin で JavaScript オブジェクトの形状を記述できます。次の JavaScript 関数とそれが返すものを考えてみましょう。

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

`external interface User` 型を使用して、Kotlin でその形状を記述する方法を見てください。

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部インターフェースはランタイム型情報を持たず、コンパイル時のみの概念です。
したがって、外部インターフェースには、通常のインターフェースと比較していくつかの制限があります。
* `is` チェックの右側で使用できません。
* クラスリテラル式（`User::class` など）で使用できません。
* 具象化された型引数として渡すことはできません。
* `as` を使用して外部インターフェースにキャストすると、常に成功します。

#### 外部オブジェクト

オブジェクトを保持するこれらの JavaScript 変数を考えてみましょう。

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

Kotlin では、これを外部オブジェクトとして使用できます。

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部型階層

通常のクラスやインターフェースと同様に、外部宣言を宣言して他の外部クラスを拡張したり、外部インターフェースを実装したりできます。
ただし、同じ型階層で外部宣言と非外部宣言を混在させることはできません。

### JavaScript コードを含む Kotlin 関数

`= js("code")` 本体を持つ関数を定義することにより、JavaScript スニペットを Kotlin/Wasm コードに追加できます。

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

JavaScript ステートメントのブロックを実行する場合は、文字列内のコードを中括弧 `{}` で囲みます。

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

オブジェクトを返す場合は、中括弧 `{}` を括弧 `()` で囲みます。

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm は `js()` 関数への呼び出しを特別な方法で処理し、実装にはいくつかの制限があります。
* `js()` 関数呼び出しには、文字列リテラル引数を指定する必要があります。
* `js()` 関数呼び出しは、関数本体の唯一の式である必要があります。
* `js()` 関数は、パッケージレベルの関数からのみ呼び出すことができます。
* [型](#type-correspondence) は、`external fun` と同様に制限されています。

Kotlin コンパイラーは、コード文字列を生成された JavaScript ファイルの関数に配置し、それを WebAssembly 形式でインポートします。
Kotlin コンパイラーは、これらの JavaScript スニペットを検証しません。
JavaScript の構文エラーがある場合、JavaScript コードを実行すると報告されます。

:::note
`@JsFun` アノテーションには同様の機能があり、非推奨になる可能性があります。

:::

### JavaScript モジュール

デフォルトでは、外部宣言は JavaScript グローバルスコープに対応します。Kotlin ファイルに
[`@JsModule` アノテーション](js-modules#jsmodule-annotation) を付けると、その中のすべての外部宣言が指定されたモジュールからインポートされます。

次の JavaScript コードサンプルを考えてみましょう。

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

`@JsModule` アノテーションを使用して、この JavaScript コードを Kotlin で使用します。

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 配列の相互運用性

JavaScript の `JsArray<T>` を Kotlin のネイティブ `Array` または `List` 型にコピーできます。同様に、これらの Kotlin 型を `JsArray<T>` にコピーできます。

`JsArray<T>` を `Array<T>` に変換したり、その逆に変換したりするには、使用可能な [アダプター関数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt) のいずれかを使用します。

ジェネリック型間の変換の例を次に示します。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// List または Array を JsArray に変換するには、.toJsArray() を使用します
val jsArray: JsArray<JsString> = list.toJsArray()

// Kotlin 型に変換し直すには、.toArray() と .toList() を使用します
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

同様のアダプター関数は、型付き配列を Kotlin と同等の配列（
たとえば、`IntArray` と `Int32Array`）に変換するために使用できます。詳細および実装については、
[`kotlinx-browser` リポジトリ]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt) を参照してください。

型付き配列間の変換の例を次に示します。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Kotlin IntArray を JavaScript Int32Array に変換するには、.toInt32Array() を使用します
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // JavaScript Int32Array を Kotlin IntArray に変換し直すには、toIntArray() を使用します
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## JavaScript で Kotlin コードを使用する

`@JsExport` アノテーションを使用して、JavaScript で Kotlin コードを使用する方法を学びます。

### @JsExport アノテーション付きの関数

Kotlin/Wasm 関数を JavaScript コードで使用できるようにするには、`@JsExport` アノテーションを使用します。

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

`@JsExport` アノテーションが付けられた Kotlin/Wasm 関数は、生成された `.mjs` モジュールの `default` エクスポートのプロパティとして表示されます。
次に、この関数を JavaScript で使用できます。

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm コンパイラーは、Kotlin コードの `@JsExport` 宣言から TypeScript 定義を生成できます。
これらの定義は、IDE および JavaScript ツールで使用して、コードの自動補完を提供したり、型チェックを支援したり、JavaScript および TypeScript から Kotlin コードを使用しやすくしたりできます。

Kotlin/Wasm コンパイラーは、`@JsExport` アノテーションが付けられたトップレベルの関数を収集し、`.d.ts` ファイルに TypeScript 定義を自動的に生成します。

TypeScript 定義を生成するには、`build.gradle.kts` ファイルの `wasmJs{}` ブロックに、`generateTypeScriptDefinitions()` 関数を追加します。

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

:::note
Kotlin/Wasm での TypeScript 宣言ファイルの生成は [Experimental](components-stability#stability-levels-explained) です。
いつでも削除または変更される可能性があります。

## 型の対応

Kotlin/Wasm では、JavaScript 相互運用宣言のシグネチャで特定の型のみが許可されます。
これらの制限は、`external`、`= js("code")`、または `@JsExport` を使用した宣言に一様に適用されます。

Kotlin の型が Javascript の型にどのように対応するかをご覧ください。

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`、`Short`、`Int`、`Char`、`UByte`、`UShort`、`UInt`、 | `Number`                          |
| `Float`、`Double`、                                         | `Number`                          |
| `Long`、`ULong`、                                           | `BigInt`                          |
| `Boolean`、                                                 | `Boolean`                         |
| `String`、                                                  | `String`                          |
| 戻り値の位置にある `Unit`                                  | `undefined`                       |
| 関数の型（例：`(String) `->` Int`）               | Function                          |
| `JsAny` およびサブタイプ                                       | 任意の JavaScript 値              |
| `JsReference`                                              | Kotlin オブジェクトへの不透明な参照 |
| その他の型                                                | サポートされていません                     |

これらの型の Null 許容バージョンも使用できます。

### JsAny 型

JavaScript の値は、`JsAny` 型とそのサブタイプを使用して Kotlin で表されます。

Kotlin/Wasm 標準ライブラリは、これらの型の一部を表現します。
* パッケージ `kotlin.js`：
    * `JsAny`
    * `JsBoolean`、`JsNumber`、`JsString`
    * `JsArray`
    * `Promise`

`external` インターフェースまたはクラスを宣言して、カスタム `JsAny` サブタイプを作成することもできます。

### JsReference 型

Kotlin の値は、`JsReference` 型を使用して不透明な参照として JavaScript に渡すことができます。

たとえば、この Kotlin クラス `User` を JavaScript に公開する場合：

```kotlin
class User(var name: String)
```

`toJsReference()` 関数を使用して `JsReference<User>` を作成し、JavaScript に返すことができます。

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

これらの参照は JavaScript で直接使用できず、空のフリーズされた JavaScript オブジェクトのように動作します。
これらのオブジェクトを操作するには、`get()` メソッドを使用して、参照値をアンラップする関数をさらに JavaScript にエクスポートする必要があります。

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

クラスを作成し、JavaScript からその名前を変更できます。

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 型パラメーター

JavaScript 相互運用宣言は、`JsAny` またはそのサブタイプの上限がある場合、型パラメーターを持つことができます。例：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 例外処理

Kotlin の `try-catch` 式を使用して、JavaScript の例外をキャッチできます。
ただし、Kotlin/Wasm では、デフォルトではスローされた値に関する特定の詳細にアクセスすることはできません。

JavaScript からの元のエラーメッセージとスタックトレースを含めるように `JsException` 型を構成できます。
これを行うには、次のコンパイラーオプションを `build.gradle.kts` ファイルに追加します。

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

この動作は、特定のブラウザーでのみ使用可能な `WebAssembly.JSTag` API に依存します。

* **Chrome：** バージョン 115 以降でサポートされています
* **Firefox：** バージョン 129 以降でサポートされています
* **Safari：** まだサポートされていません

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

        // JavaScript の完全なスタックトレースを出力します
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` コンパイラーオプションを有効にすると、`JsException` 型は JavaScript エラーからの特定の詳細を提供します。
このコンパイラーオプションを有効にしない場合、`JsException` には JavaScript コードの実行中に例外がスローされたことを示す一般的なメッセージのみが含まれます。

JavaScript の `try-catch` 式を使用して Kotlin/Wasm の例外をキャッチしようとすると、
直接アクセス可能なメッセージやデータのない一般的な `WebAssembly.Exception` のように見えます。

## Kotlin/Wasm と Kotlin/JS の相互運用性の違い

<a name="differences"/>

Kotlin/Wasm の相互運用性は Kotlin/JS の相互運用性と類似点を共有していますが、考慮すべき重要な違いがあります。

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **外部 enum**      | 外部 enum クラスをサポートしていません。                                                                                                                                                                              | 外部 enum クラスをサポートしています。                                                                                                                     |
| **型の拡張**     | 外部型を拡張するために非外部型をサポートしていません。                                                                                                                                                        | 非外部型をサポートしています。                                                                                                                        |
| **`JsName` アノテーション** | 外部宣言にアノテーションを付ける場合にのみ効果があります。                                                                                                                                                           | 通常の非外部宣言の名前を変更するために使用できます。                                                                                   |
| **`js()` 関数**       | `js("code")` 関数呼び出しは、パッケージレベル関数の単一の式本体として許可されています。                                                                                                                     | `js("code")` 関数は任意のコンテキストで呼び出すことができ、`dynamic` 値を返します。                                                               |
| **モジュールシステム**      | ES モジュールのみをサポートしています。`@JsNonModule` アノテーションに相当するものはありません。`default` オブジェクトのプロパティとしてエクスポートを提供します。パッケージレベルの関数のみのエクスポートを許可します。                           | ES モジュールとレガシーモジュールシステムをサポートしています。名前付き ESM エクスポートを提供します。クラスとオブジェクトのエクスポートを許可します。                                    |
| **型**               | より厳密な型制限をすべての相互運用宣言 `external`、`= js("code")`、および `@JsExport` に一様に適用します。[組み込みの Kotlin 型と `JsAny` サブタイプ](#type-correspondence) の選択された数を許可します。 | `external` 宣言ですべての型を許可します。[`@JsExport` で使用できる型](js-to-kotlin-interop#kotlin-types-in-javascript) を制限します。 |
| **Long**                | 型は JavaScript `BigInt` に対応します。                                                                                                                                                                            | JavaScript のカスタムクラスとして表示されます。                                                                                                            |
| **配列**              | まだ直接相互運用でサポートされていません。代わりに新しい `JsArray` 型を使用できます。                                                                                                                                  | JavaScript 配列として実装されます。                                                                                                                   |
| **その他の型**         | Kotlin オブジェクトを JavaScript に渡すには `JsReference<>` が必要です。                                                                                                                                                      | 外部宣言で非外部 Kotlin クラス型を使用できます。                                                                         |
| **例外処理**  | `JsException` および `Throwable` 型で JavaScript 例外をキャッチできます。                                                                                                                                | `Throwable` 型を使用して JavaScript `Error` をキャッチできます。`dynamic` 型を使用して JavaScript 例外をキャッチできます。                            |
| **動的型**       | `dynamic` 型をサポートしていません。代わりに `JsAny` を使用してください（以下のサンプルコードを参照）。                                                                                                                                   | `dynamic` 型をサポートしています。                                                                                                                        |

Kotlin/JS の [動的型](dynamic-type) は、型指定されていないオブジェクトまたは型が緩やかに指定されたオブジェクトとの相互運用性のため、
Kotlin/Wasm ではサポートされていません。`dynamic` 型の代わりに、`JsAny` 型を使用できます。

```kotlin
// Kotlin/JS
fun processUser(user: dynamic, age: Int) {
    // ...
    user.profile.updateAge(age)
    // ...
}

// Kotlin/Wasm
private fun updateUserAge(user: JsAny, age: Int): Unit =
    js("{ user.profile.updateAge(age); }")

fun processUser(user: JsAny, age: Int) {
    // ...
    updateUserAge(user, age)
    // ...
}
```

:::

## Web 関連のブラウザー API

[`kotlinx-browser` ライブラリ](https://github.com/kotlin/kotlinx-browser) は、次のものを含む JavaScript ブラウザー API を提供するスタンドアロン
ライブラリです。
* パッケージ `org.khronos.webgl`：
  * `Int8Array` などの型付き配列。
  * WebGL 型。
* パッケージ `org.w3c.dom.*`：
  * DOM API 型。
* パッケージ `kotlinx.browser`：
  * `window` や `document` などの DOM API グローバルオブジェクト。

`kotlinx-browser` ライブラリからの宣言を使用するには、プロジェクトのビルド構成ファイルに依存関係として追加します。

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```
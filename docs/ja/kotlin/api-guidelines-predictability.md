[//]: # (title: 予測可能性)

堅牢で使いやすいKotlinライブラリを設計するには、一般的なユースケースを想定し、拡張性を考慮し、適切な使用法を強制することが不可欠です。
デフォルト設定、エラー処理、状態管理に関するベストプラクティスに従うことで、ライブラリの整合性と品質を維持しつつ、ユーザーにシームレスな体験を提供できます。

## デフォルトで適切な動作をさせる

あなたのライブラリは、それぞれのユースケースにおける「ハッピーパス」を想定し、それに応じてデフォルト設定を提供すべきです。
ライブラリが正しく機能するために、ユーザーがデフォルト値を指定する必要があってはなりません。

たとえば、[Ktor `HttpClient`](https://ktor.io/docs/client-create-new-application.html)を使用する際、最も一般的なユースケースはサーバーへのGETリクエストの送信です。
これは以下のコードで実現でき、必要不可欠な情報のみを指定すればよいようになっています。

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.get("https://ktor.io/")
```

必須のHTTPヘッダーや、レスポンスで起こりうるステータスコードに対するカスタムイベントハンドラーの値を指定する必要はありません。

ユースケースに明確な「ハッピーパス」がない場合や、パラメーターにデフォルト値を持たせるべきだが異論のない選択肢がない場合は、
それは要件分析に欠陥があることを示している可能性があります。

## 拡張の機会を提供する

正しい選択肢を予測できない場合は、ユーザーが好むアプローチを指定できるようにします。
あなたのライブラリは、ユーザーが独自のアプローチを提供したり、サードパーティ製拡張機能を使用したりできるようにすべきです。

たとえば、[Ktor `HttpClient`](https://ktor.io/docs/client-serialization.html)では、ユーザーはクライアントの設定時にコンテンツネゴシエーションのサポートをインストールし、好みのシリアライゼーション形式を指定することが推奨されています。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

ユーザーは、どのプラグインをインストールするかを選択したり、[クライアントプラグインを定義するための独立したAPI](https://ktor.io/docs/client-custom-plugins.html)を使用して独自のプラグインを作成したりできます。

さらに、ユーザーはライブラリ内の型に対して拡張関数やプロパティを定義できます。
ライブラリの作者として、あなたは[拡張機能を念頭に置いて設計する](api-guidelines-readability.md#use-extension-functions-and-properties)ことでこれを容易にし、
ライブラリの型が明確なコアコンセプトを持つことを保証できます。

## 意図しない不正な拡張を防止する

ユーザーがライブラリを、その元の設計に違反するような方法や、問題領域のルール内で不可能な方法で拡張できないようにすべきです。

たとえば、JSONとの間でデータをマーシャリングする際、出力形式でサポートされる型は以下の6種類のみです。
`object`、`array`、`number`、`string`、`boolean`、`null`。

`JsonElement`というオープンクラスまたはインターフェースを作成した場合、ユーザーは`JsonDate`のような不正な派生型を作成できてしまう可能性があります。
代わりに、`JsonElement`インターフェースをシールドにし、各型に実装を提供することができます。

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

シールド型は、コンパイラが`when`式が網羅的であることを保証できるようにするため、`else`ステートメントを必要とせず、
可読性と一貫性を向上させます。

## 可変状態の公開を避ける

複数の値を管理する際、APIは可能な限り読み取り専用コレクションを受け入れ、また返すようにすべきです。
可変コレクションはスレッドセーフではなく、ライブラリに複雑さと予測不能性をもたらします。

たとえば、ユーザーがAPIのエントリポイントから返された可変コレクションを変更した場合、
それが実装の構造を修正しているのか、それともコピーを修正しているのかが不明確になります。
同様に、ユーザーがコレクションをライブラリに渡した後にその中の値を変更できる場合、それが実装に影響するかどうかが不明確になります。

配列は可変コレクションであるため、APIでの使用は避けてください。
配列を使用する必要がある場合は、ユーザーとデータを共有する前に防御的コピーを作成してください。これにより、データ構造が変更されないことが保証されます。

防御的コピーを作成するこのポリシーは、`vararg`引数に対してはコンパイラによって自動的に実行されます。
`vararg`引数が期待される場所に既存の配列をスプレッド演算子を使用して渡す場合、配列のコピーが自動的に作成されます。

この動作は以下の例で示されています。

```kotlin
fun main() {
    fun demo(vararg input: String): Array<out String> = input

    val originalArray = arrayOf("one", "two", "three", "four")
    val newArray = demo(*originalArray)

    originalArray[1] = "ten"

    // "one, ten, three, four"と出力される
    println(originalArray.joinToString())

    // "one, two, three, four"と出力される
    println(newArray.joinToString())
}
```

## 入力と状態を検証する

実装が進む前に、入力と既存の状態を検証することで、ライブラリが正しく使用されていることを確認してください。
入力の検証には[`require`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html)関数を、既存の状態の検証には[`check`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html)関数を使用してください。

`require`関数は、条件が`false`の場合に[`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/#kotlin.IllegalArgumentException)をスローし、適切なエラーメッセージとともに即座に関数を失敗させます。

```kotlin
fun saveUser(username: String, password: String) {
    require(username.isNotBlank()) { "Username should not be blank" }
    require(username.all { it.isLetterOrDigit() }) {
        "Username can only contain letters and digits, was: $username"
    }
    require(password.isNotBlank()) { "Password should not be blank" }
    require(password.length >= 7) {
        "Password must contain at least 7 characters"
    }

    /* Implementation can proceed */
}
```

上記のように、不正な文字を含むユーザー名のエラーメッセージのように、ユーザーが失敗の原因を特定するのに役立つように、エラーメッセージには関連する入力を含めるべきです。
この慣行の例外として、エラーメッセージに値を含めることで、セキュリティエクスプロイトの一部として悪用される可能性のある情報が明らかになる場合があり、これがパスワードの長さのエラーメッセージにパスワード入力が含まれない理由です。

同様に、`check`関数は、条件が`false`の場合に[`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/#kotlin.IllegalStateException)をスローします。
以下の例に示すように、この関数はインスタンスの状態を検証するために使用します。

```kotlin
class ShoppingCart {
    private val contents = mutableListOf<Item>()

    fun addItem(item: Item) {
       contents.add(item)
    }

    fun purchase(): Amount {
       check(contents.isNotEmpty()) {
           "Cannot purchase an empty cart"
       }
       // Calculate and return amount
    }
}
```

## 次のステップ

ガイドの次のパートでは、デバッグ可能性について学びます。

[次のパートに進む](api-guidelines-debuggability.md)
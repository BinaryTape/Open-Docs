[//]: # (title: デバッグの容易性)

あなたのライブラリのユーザーは、その機能の上に構築を行い、彼らが構築する機能には特定して解決する必要があるエラーが含まれるでしょう。このエラー解決プロセスは、開発中にデバッガー内で行われることもあれば、本番環境でロギングおよび可観測性ツールを使用することもあります。あなたのライブラリは、デバッグを容易にするために以下のベストプラクティスに従うことができます。

## 状態を持つ型にtoStringメソッドを提供する

状態を持つすべての型について、意味のある `toString` 実装を提供してください。この実装は、たとえ内部的な型であっても、インスタンスの現在の内容を分かりやすく表現するものを返すようにすべきです。

型の `toString` 表現はしばしばログに書き込まれるため、このメソッドを実装する際にはセキュリティを考慮し、機密性の高いユーザーデータを返さないようにしてください。

状態を記述するために使用される形式は、ライブラリ内の異なる型間で可能な限り一貫性があるようにしてください。この形式は、APIによって実装されるコントラクトの一部である場合、明示的に記述され、十分に文書化されるべきです。`toString` メソッドからの出力は、例えば自動テストスイートで、パースをサポートする可能性があります。

例えば、サービス購読をサポートするライブラリの以下の型を考えてみましょう。

```kotlin
enum class SubscriptionResultReason {
    Success, InsufficientFunds, IncompatibleAccount
}

class SubscriptionResult(
    val result: Boolean,
    val reason: SubscriptionResultReason,
    val description: String
)
```

`toString` メソッドがない場合、`SubscriptionResult` インスタンスをそのまま表示しても、あまり有用ではありません。

```kotlin
fun main() {
    val result = SubscriptionResult(
       false,
       IncompatibleAccount,
       "Users account does not support this type of subscription"
    )
    
    //prints 'org.example.SubscriptionResult@13221655'
    println(result)
}
```

デバッガーでも、情報がすぐには表示されません。

![Results in the debugger](debugger-result.png){width=500}

シンプルな `toString` 実装を追加すると、どちらの場合でも出力が大幅に改善されます。

```kotlin
//prints 'Subscription failed (reason=IncompatibleAccount, description="Users 
// account does not support this type of subscription")'
override fun toString(): String {
    val resultText = if(result) "succeeded" else "failed"
    return "Subscription $resultText (reason=$reason, description=\"$description\")"
}
```

![Adding toString results in a much better result](debugger-result-tostring.png){width=700}

`toString` メソッドを自動的に得るためにデータクラスを使用することは魅力的かもしれませんが、後方互換性の理由から推奨されません。データクラスについては、[APIでのデータクラスの使用を避ける](api-guidelines-backward-compatibility.md#avoid-using-data-classes-in-your-api)セクションで詳しく説明されています。

`toString` メソッドで記述される状態は、問題領域からの情報である必要はないことに注意してください。それは、進行中のリクエストのステータス（上記の例のように）、外部サービスへの接続の健全性、または進行中の操作における中間状態に関連する可能性があります。

例えば、以下のビルダー型を考えてみましょう。

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()

    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
       children.add(person(personBuilder))
    }
    fun build(): Person = Person(name, age, children)
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person = 
    PersonBuilder().apply(personBuilder).build()
```

この型の使用例は次のとおりです。

![Using the builder type example](halt-breakpoint.png){width=500}

上記の画像に表示されているブレークポイントでコードを停止させると、表示される情報はあまり有用ではありません。

![Halting code at the breakpoint result](halt-result.png){width=500}

シンプルな `toString` 実装を追加すると、はるかに有用な出力が得られます。

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

この追加により、デバッガーは次のように表示します。

![Adding toString to the halt point](halt-tostring-result.png){width=700}

これにより、どのフィールドが設定されており、どれが設定されていないかを即座に確認できます。

## 例外処理のポリシーを採用し、文書化する

[適切なエラー処理メカニズムの選択](api-guidelines-consistency.md#choose-the-appropriate-error-handling-mechanism)セクションで議論されているように、ライブラリがエラーを通知するために例外をスローすることが適切な場合があります。この目的のために、独自の例外型を作成することもできます。

低レベルAPIを抽象化および簡素化するライブラリは、その依存関係によってスローされる例外も処理する必要があります。ライブラリは、例外を抑制するか、そのまま渡すか、異なる型の例外に変換するか、または異なる方法でユーザーにエラーを通知するかを選択できます。

これらのオプションのいずれも、コンテキストによっては有効です。例えば、

*   ユーザーがライブラリBを簡素化する利便性のためだけにライブラリAを採用する場合、ライブラリAがライブラリBによって生成された例外を修正せずに再スローすることが適切である場合があります。
*   ライブラリAがライブラリBを純粋に内部的な実装の詳細として採用する場合、ライブラリBによってスローされるライブラリ固有の例外は、ライブラリAのユーザーに決して公開されるべきではありません。

ユーザーがあなたのライブラリを効果的に使用できるように、例外処理に対する一貫したアプローチを採用し、文書化する必要があります。これはデバッグにとって特に重要です。ライブラリのユーザーは、デバッガーやログにおいて、例外があなたのライブラリから発生したものであることを認識できるべきです。

例外の型はエラーの種類を示すべきであり、例外に含まれるデータはユーザーが問題の根本原因を特定するのに役立つべきです。一般的なパターンは、低レベルの例外をライブラリ固有の例外でラップし、元の例外が `cause` としてアクセスできるようにすることです。

## 次のステップ

ガイドの次のパートでは、テスト容易性について学びます。

[次のパートに進む](api-guidelines-testability.md)
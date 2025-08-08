[//]: # (title: 整合性)

API設計において、整合性は使いやすさを確保するために不可欠です。一貫したパラメータの順序、命名規則、およびエラーハンドリングメカニズムを維持することで、ライブラリはユーザーにとってより直感的で信頼性の高いものになります。これらのベストプラクティスに従うことは、混乱や誤用を避け、より良い開発者体験とより堅牢なアプリケーションにつながります。

## パラメータの順序、命名、および使用法を維持する

ライブラリを設計する際は、引数の順序、命名規則、オーバーロードの使用において一貫性を保ってください。
たとえば、既存のメソッドに`offset`と`length`パラメータがある場合、よほどの理由がない限り、新しいメソッドで`startIndex`や`endIndex`のような代替を使用すべきではありません。

ライブラリが提供するオーバーロードされた関数は、同一の振る舞いをするべきです。
ユーザーは、ライブラリに渡す値の型を変更しても、その振る舞いが一貫していることを期待します。
たとえば、以下の呼び出しはすべて、入力が意味的に同じであるため、同一のインスタンスを作成します。

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

`startIndex`と`stopIndex`のようなパラメータ名を、`beginIndex`と`endIndex`のような同義語と混同しないようにしてください。
同様に、コレクション内の値には`element`、`item`、`entry`、`entity`のいずれかの用語を選択し、それを守ってください。

関連するメソッドは一貫性があり、予測可能な名前を付けるべきです。例として、Kotlin標準ライブラリには`first`と`firstOrNull`、`single`や`singleOrNull`のようなペアが含まれています。
これらのペアは、一方が`null`を返す可能性があるのに対し、他方は例外をスローする可能性があることを明確に示しています。
パラメータは一般的なものから具体的なものへと宣言されるべきであり、必須の入力が最初に、オプションの入力が最後に現れるようにします。
たとえば、[`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html)では、`strings`コレクションが最初に、次に`startIndex`、最後に`ignoreCase`フラグが続きます。

従業員記録を管理し、従業員を検索するための以下のAPIを提供するライブラリを考えてみましょう。

```kotlin
fun findStaffBySeniority(
    startIndex: Int, 
    minYearsServiceExclusive: Int
): List<Employee>

fun findStaffByAge(
    minAgeInclusive: Int, 
    startIndex: Int
): List<Employee>
```

このAPIは、正しく使用するのが極めて難しいでしょう。
同じ型の複数のパラメータが一貫性のない順序で提示され、一貫性のない方法で使用されています。
ライブラリのユーザーは、既存の関数での経験に基づいて、新しい関数について誤った仮定をしてしまう可能性が高いです。

## データと状態にオブジェクト指向設計を使用する

Kotlinは、オブジェクト指向プログラミングスタイルと関数型プログラミングスタイルの両方をサポートしています。
APIでは、クラスを使用してデータと状態を表現してください。データと状態が階層的である場合は、継承の使用を検討してください。

必要なすべての状態がパラメータとして渡せる場合は、トップレベル関数の使用を推奨します。
これらの関数への呼び出しが連鎖する場合、可読性を向上させるために拡張関数として記述することを検討してください。

## 適切なエラーハンドリングメカニズムを選択する

Kotlinは、エラーハンドリングのためのいくつかのメカニズムを提供しています。
あなたのAPIは、例外をスローする、`null`値を返す、カスタムの結果型を使用する、または組み込みの[`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/)型を使用することができます。
ライブラリがこれらのオプションを一貫して適切に使用するようにしてください。

データを取得または計算できない場合は、ヌル許容戻り値型を使用して`null`を返し、データが見つからないことを示します。
その他の場合は、例外をスローするか、`Result`型を返します。

関数のオーバーロードを提供することを検討してください。一方が例外をスローし、もう一方がそれを結果型でラップするものです。
これらの場合、関数内で例外がキャッチされることを示すために`Catching`サフィックスを使用してください。
たとえば、標準ライブラリにはこの慣例を使用する[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)関数と[`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html)関数があり、
コルーチンライブラリにはチャネル用の[`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html)メソッドと[`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html)メソッドがあります。

通常の制御フローに例外を使用することは避けてください。操作を試みる前に条件チェックを可能にするようにAPIを設計し、
不要なエラーハンドリングを防止してください。
[Command / Query Separation](https://martinfowler.com/bliki/CommandQuerySeparation.html)は、ここで適用できる有用なパターンです。

## 規約と品質を維持する

整合性の最後の側面は、ライブラリ自体の設計ではなく、高いレベルの品質を維持することに関連しています。

コードが一般的なKotlinの規約とプロジェクト固有の規約の両方に従っていることを確認するために、静的解析用の自動化ツール（リンター）を使用すべきです。

Kotlinライブラリはまた、すべてのAPIエントリーポイントのドキュメント化されたすべての振る舞いを網羅する単体テストおよび統合テストのスイートを提供すべきです。
テストには、特に既知の境界値とエッジケースを含め、幅広い入力を含めるべきです。テストされていない振る舞いは、（良くても）信頼できないと見なすべきです。

開発中にこのテストスイートを使用して、変更が既存の振る舞いを壊さないことを検証してください。
標準化されたビルドおよびリリースパイプラインの一部として、すべてのリリースでこれらのテストを実行してください。
[Kover](https://github.com/Kotlin/kotlinx-kover)のようなツールは、ビルドプロセスに統合してカバレッジを測定し、レポートを生成できます。

## 次のステップ

ガイドの次のパートでは、予測可能性について学びます。

[次のパートに進む](api-guidelines-predictability.md)
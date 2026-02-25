[//]: # (title: 一貫性)

API設計において一貫性は、使いやすさを確保するために極めて重要です。パラメーターの順序、命名規則、およびエラーハンドリングメカニズムの一貫性を維持することで、ライブラリはユーザーにとってより直感的で信頼性の高いものになります。これらのベストプラクティスに従うことで、混乱や誤用を避け、より優れた開発者体験とより堅牢なアプリケーションの構築につながります。

## パラメーターの順序、命名、および使用方法を維持する

ライブラリを設計する際は、引数の順序、命名体系、およびオーバーロードの使用において一貫性を維持してください。
例えば、既存のメソッドに `offset` と `length` というパラメーターがある場合、説得力のある理由がない限り、新しいメソッドで `startIndex` や `endIndex` といった代替案に切り替えるべきではありません。

ライブラリが提供するオーバーロードされた関数は、同一の動作をさせるべきです。
ユーザーは、ライブラリに渡す値の型を変更しても、動作が一貫していることを期待します。
例えば、以下の呼び出しは、入力が意味的に同じであるため、すべて同一のインスタンスを作成します。

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

`startIndex` や `stopIndex` といったパラメーター名を、`beginIndex` や `endIndex` といった類義語と混ぜて使用することは避けてください。
同様に、コレクション内の値に対しては、`element`、`item`、`entry`、`entity` などの中から1つの用語を選択し、それを使い続けてください。

関連するメソッドには、一貫性があり予測可能な名前を付けてください。例として、Kotlin標準ライブラリには `first` と `firstOrNull`、`single` と `singleOrNull` のようなペアが含まれています。
これらのペアは、一方が `null` を返す可能性があり、もう一方が例外をスローする可能性があることを明確に示しています。
パラメーターは一般的なものから具体的なものの順に宣言し、必須の入力が最初、オプションの入力が最後に来るようにします。
例えば、[`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) では、`strings` コレクションが最初に来て、次に `startIndex`、最後に `ignoreCase` フラグが続きます。

従業員レコードを管理し、従業員を検索するための以下のAPIを提供するライブラリを考えてみましょう。

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

このAPIを正しく使用するのは非常に困難です。
同じ型の複数のパラメーターが一貫性のない順序で提示されており、使い方も一貫していません。
ライブラリのユーザーは、既存の関数での経験に基づいて、新しい関数についても誤った推測をしてしまう可能性が高いです。

## データと状態にはオブジェクト指向設計を使用する

Kotlinはオブジェクト指向と関数型プログラミングの両方のスタイルをサポートしています。
APIにおいてデータと状態を表現するには、クラスを使用してください。データと状態が階層構造を持つ場合は、継承の使用を検討してください。

必要なすべての状態をパラメーターとして渡すことができる場合は、トップレベル関数の使用を優先してください。
これらの関数の呼び出しを連鎖させる（チェーンする）場合は、可読性を向上させるために拡張関数として記述することを検討してください。

## 適切なエラーハンドリングメカニズムを選択する

Kotlinはエラーハンドリングのためにいくつかのメカニズムを提供しています。
APIは、例外をスローする、`null` 値を返す、カスタムの結果型（result type）を使用する、または組み込みの [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 型を使用することができます。
ライブラリがこれらのオプションを一貫して、かつ適切に使用していることを確認してください。

データを取得または計算できない場合は、nullableな戻り値の型を使用し、データがないことを示すために `null` を返します。
それ以外の場合は、例外をスローするか、`Result` 型を返します。

一方が例外をスローし、もう一方がそれを結果型でラップするような、関数のオーバーロードを提供することを検討してください。
その場合、関数内で例外がキャッチされることを示すために、`Catching` 接尾辞を使用します。
例えば、標準ライブラリにはこの慣習を使用した [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) と [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 関数があり、コルーチンライブラリにはチャネル用に [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) と [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) メソッドがあります。

通常の制御フローに例外を使用することは避けてください。操作を試みる前に条件チェックを可能にするようにAPIを設計し、不要なエラーハンドリングを防ぎます。
[コマンド・クエリ分離 (Command / Query Separation)](https://martinfowler.com/bliki/CommandQuerySeparation.html) は、ここで適用できる有用なパターンです。

## 規約と品質を維持する

一貫性の最後の側面は、ライブラリ自体の設計ではなく、高い品質レベルを維持することに関係します。

静的解析用の自動化ツール（リンター）を使用して、コードが一般的なKotlinの規約とプロジェクト固有の規約の両方に従っていることを確認する必要があります。

Kotlinライブラリは、すべてのAPIエントリポイントのドキュメント化されたすべての動作をカバーする、ユニットテストおよびインテグレーションテストのスイートも提供する必要があります。
テストには、幅広い入力、特に既知の境界値やエッジケースを含めるべきです。テストされていない動作は、（良くても）信頼できないものと見なされるべきです。

開発中にこのテストスイートを使用して、変更によって既存の動作が壊れないことを確認してください。
標準化されたビルドおよびリリースパイプラインの一環として、リリースのたびにこれらのテストを実行してください。
[Kover](https://github.com/Kotlin/kotlinx-kover) のようなツールをビルドプロセスに統合して、カバレッジを測定し、レポートを生成することができます。

## 次のステップ

ガイドの次のパートでは、予測可能性について学びます。

[次のパートへ進む](api-guidelines-predictability.md)
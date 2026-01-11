[//]: # (title: ライブラリ作成者向け後方互換性ガイドライン)

ライブラリを作成する最も一般的な動機は、より幅広いコミュニティに機能を提供することです。
このコミュニティは、単一のチーム、企業、特定の業界、またはテクノロジープラットフォームである可能性があります。
どのような場合でも、後方互換性は重要な考慮事項となります。
コミュニティが広がるほど、ユーザーが誰であり、どのような制約の中で作業しているかを把握しにくくなるため、後方互換性はより重要になります。

後方互換性とは単一の用語ではなく、バイナリ、ソース、および振る舞いの各レベルで定義できます。
これらのタイプに関する詳細は、このセクションで説明します。

次の点に注意してください。

*   ソース互換性を損なわずにバイナリ互換性を損なうこと、またその逆も可能です。
*   ソース互換性を保証することは望ましいですが、非常に困難です。ライブラリ作成者は、ライブラリのユーザーが関数または型を呼び出し、あるいはインスタンス化するあらゆる可能な方法を考慮しなければなりません。
ソース互換性は通常、目標であり、約束ではありません。

このセクションの残りの部分では、さまざまな種類の互換性を確保するのに役立つアクションとツールについて説明します。

## 互換性の種類 {initial-collapse-state="collapsed" collapsible="true"}

**バイナリ互換性**とは、ライブラリの新しいバージョンが、以前にコンパイルされたライブラリのバージョンを置き換えることができることを意味します。
以前のバージョンのライブラリに対してコンパイルされたソフトウェアは、引き続き正しく動作するはずです。

> バイナリ互換性の詳細については、[バイナリ互換性バリデーターのREADME](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api)または[JavaベースのAPIの進化](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md)ドキュメントを参照してください。
>
{style="tip"}

**ソース互換性**とは、ライブラリの新しいバージョンが、ライブラリを使用するソースコードを一切変更することなく、以前のバージョンを置き換えることができることを意味します。ただし、このクライアントコードのコンパイル出力は、ライブラリのコンパイル出力と互換性がなくなる可能性があるため、互換性を保証するにはクライアントコードを新しいバージョンのライブラリに対して再ビルドする必要があります。

**振る舞いの互換性**とは、ライブラリの新しいバージョンが、バグ修正を除いて既存の機能を変更しないことを意味します。同じ機能が関与し、同じセマンティクスを持ちます。

## バイナリ互換性バリデーターを使用する

JetBrainsは、APIの異なるバージョン間でのバイナリ互換性を確保するために使用できる[バイナリ互換性バリデーター](https://github.com/Kotlin/binary-compatibility-validator)ツールを提供しています。

このツールはGradleプラグインとして実装されており、ビルドに2つのタスクを追加します。

*   `apiDump` タスクは、APIを記述する人間が読める形式の `.api` ファイルを作成します。
*   `apiCheck` タスクは、保存されたAPIの記述と現在のビルドでコンパイルされたクラスを比較します。

`apiCheck` タスクは、標準のGradle `check` タスクによってビルド時に呼び出されます。
互換性が損なわれた場合、ビルドは失敗します。その時点で、`apiDump` タスクを手動で実行し、以前のバージョンと新しいバージョンの違いを比較する必要があります。
変更に問題がなければ、VCS内にある既存の `.api` ファイルを更新できます。

このバリデーターは、マルチプラットフォームライブラリによって生成された[KLibの検証に関する実験的サポート](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)を提供します。

### Kotlin Gradleプラグインにおけるバイナリ互換性検証

<primary-label ref="experimental-general"/>

バージョン2.2.0以降、Kotlin Gradleプラグインはバイナリ互換性検証をサポートしています。詳細については、[Kotlin Gradleプラグインにおけるバイナリ互換性検証](gradle-binary-compatibility-validation.md)を参照してください。

## 戻り値の型を明示的に指定する

[Kotlinコーディングガイドライン](coding-conventions.md#coding-conventions-for-libraries)で説明されているように、API内の関数戻り値の型とプロパティの型は常に明示的に指定する必要があります。[明示的なAPIモード](api-guidelines-simplicity.md#use-explicit-api-mode)に関するセクションも参照してください。

次の例を考えてみましょう。ライブラリ作成者が `JsonDeserializer` を作成し、便宜のために拡張関数を使用して `Int` 型と関連付けています。

```kotlin
class JsonDeserializer<T>(private val fromJson: (String) -> T) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonDeserializer { ... }
```

作成者がこの実装を `JsonOrXmlDeserializer` に置き換えたとします。

```kotlin
class JsonOrXmlDeserializer<T>(
    private val fromJson: (String) -> T,
    private val fromXML: (String) -> T
) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonOrXmlDeserializer({ ... }, { ... })
```

既存の機能は引き続き動作し、XMLをデシリアライズする機能が追加されます。しかし、これはバイナリ互換性を損ないます。

## 既存のAPI関数への引数追加を避ける

パブリックAPIに非デフォルト引数を追加すると、ユーザーは以前よりも多くの情報を提供する必要があるため、バイナリ互換性とソース互換性の両方が損なわれます。
しかし、[デフォルト引数](functions.md#parameters-with-default-values)を追加するだけでも互換性が損なわれる可能性があります。

例えば、`lib.kt` に次の関数があるとします。

```kotlin
fun fib() = … // Returns zero
```

そして、`client.kt` に次の関数があるとします。

```kotlin
fun main() {
    println(fib()) // Prints zero
}
```
これら2つのファイルをJVM上でコンパイルすると、`LibKt.class` と `ClientKt.class` が出力されます。

`fib` 関数をフィボナッチ数列を表すように再実装してコンパイルし、`fib(3)` が2を返し、`fib(4)` が3を返すなどとしたとします。
パラメータを追加しますが、既存の動作を維持するためにデフォルト値をゼロにします。

```kotlin
fun fib(input: Int = 0) = … // Returns Fibonacci member
```

これで `lib.kt` ファイルを再コンパイルする必要があります。`client.kt` ファイルは再コンパイルする必要がなく、関連するクラスファイルは次のように呼び出せると思うかもしれません。

```shell
$ kotlin ClientKt.class
```

しかし、これを試すと `NoSuchMethodError` が発生します。

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

これは、Kotlin/JVMコンパイラによって生成されたバイトコードでメソッドのシグネチャが変更され、バイナリ互換性が損なわれたためです。

しかし、ソース互換性は維持されます。両方のファイルを再コンパイルすれば、プログラムは以前と同様に実行されます。

### 互換性維持のためオーバーロードを使用する {initial-collapse-state="collapsed" collapsible="true"}

バイナリ互換性を維持するために、関数に新しいパラメータを追加したい場合は、デフォルト引数を持つ単一の関数を使用する代わりに、複数のオーバーロードを手動で作成する必要があります。上記の例では、`Int` パラメータを受け取りたい場合に備えて、別の `fib()` 関数を作成することを意味します。

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

JVM向けKotlinコードを記述する場合、デフォルト引数を持つ [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) アノテーションが付けられた関数にパラメータを追加する際には注意してください。このアノテーションはバイナリ互換性を維持しないため、手動でオーバーロードを追加する必要があります。

## 戻り値の型を広げたり狭めたりするのを避ける

APIを進化させる際、関数の戻り値の型を広げたり狭めたりしたいと考えるのは一般的です。
例えば、APIの次期バージョンで、戻り値の型を `List` から `Collection` に、または `Collection` から `List` に切り替えたいと考えるかもしれません。

インデックスサポートに対するユーザーの要求に応えるために、型を `List` に狭めたいと考えるかもしれません。
逆に、扱っているデータに自然な順序がないことに気づいたため、型を `Collection` に広げたいと考えるかもしれません。

戻り値の型を広げると互換性が損なわれる理由は簡単に理解できます。例えば、`List` から `Collection` への変換は、インデックスを使用するすべてのコードを破壊します。

戻り値の型を狭めること、例えば `Collection` から `List` へと変更すれば互換性が維持されると考えるかもしれません。
残念ながら、ソース互換性は維持されますが、バイナリ互換性は損なわれます。

`Library.kt` ファイルにデモ関数があるとします。

```kotlin
public fun demo(): Number = 3
```

そして、`Client.kt` にその関数のクライアントがあるとします。

```kotlin
fun main() {
    println(demo()) // Prints 3
}
```

`demo` の戻り値の型を変更し、`Library.kt` だけを再コンパイルするシナリオを想像してみましょう。

```kotlin
fun demo(): Int = 3
```

クライアントを再実行すると、以下のエラーが発生します (JVM上)。

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        …
```

これは、`main` メソッドから生成されたバイトコード内の以下の命令が原因で発生します。

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVMは `Number` を返す `demo` と呼ばれる静的メソッドを呼び出そうとしています。
しかし、このメソッドはもはや存在しないため、バイナリ互換性が損なわれています。

## APIでのデータクラスの使用を避ける

通常開発では、データクラスの強みは自動生成される追加関数です。
API設計においては、この強みが弱点となります。

例えば、APIで次のデータクラスを使用するとします。

```kotlin
data class User(
    val name: String,
    val email: String
)
```

後で、`active` と呼ばれるプロパティを追加したいと考えるかもしれません。

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

これは2つの方法でバイナリ互換性を損ないます。まず、生成されるコンストラクタのシグネチャが異なります。
さらに、生成される `copy` メソッドのシグネチャも変更されます。

元のシグネチャ (Kotlin/JVM上) は次のようになります。

```text
public final User copy(java.lang.String, java.lang.String)
```

`active` プロパティを追加すると、シグネチャは次のようになります。

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

コンストラクタと同様に、これはバイナリ互換性を損ないます。

これらの問題を回避するには、セカンダリコンストラクタを手動で記述し、`copy` メソッドをオーバーライドすることで可能です。
しかし、これには手間がかかり、データクラスを使用する利便性が失われます。

データクラスのもう一つの問題は、コンストラクタ引数の順序を変更すると、分解に使用される生成された `componentX` メソッドに影響を与えることです。
バイナリ互換性を損なわないとしても、順序を変更すると確実に振る舞いの互換性が損なわれます。

## PublishedApiアノテーション使用時の考慮事項

Kotlinでは、インライン関数をライブラリのAPIの一部にすることができます。これらの関数への呼び出しは、ユーザーが記述したクライアントコードにインライン化されます。
これにより互換性の問題が発生する可能性があるため、これらの関数は非パブリックAPI宣言を呼び出すことはできません。

インライン化されたパブリック関数からライブラリの内部APIを呼び出す必要がある場合は、[`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) でアノテーションを付けることで可能です。
これにより、コンパイルされたクライアントコードに参照が含まれるため、内部宣言は事実上パブリックになります。
したがって、変更を加える際にはパブリック宣言と同じように扱う必要があります。これらの変更がバイナリ互換性に影響を与える可能性があるためです。

## APIを実用的に進化させる

時間の経過とともに、既存の宣言を削除または変更することで、ライブラリのAPIに破壊的な変更を加える必要がある場合があります。
このセクションでは、そのようなケースを実用的に処理する方法について説明します。

ユーザーがライブラリの新しいバージョンにアップグレードする際、プロジェクトのソースコードにライブラリのAPIへの未解決の参照が残ってはいけません。
ライブラリのパブリックAPIから何かをすぐに削除するのではなく、非推奨サイクルに従うべきです。
こうすることで、ユーザーに代替APIへの移行時間を与えることができます。

古い宣言に [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) アノテーションを使用し、それが置き換えられることを示します。このアノテーションのパラメータは、非推奨に関する重要な詳細を提供します。

*   `message` は、何が変更され、なぜ変更されるのかを説明する必要があります。
*   `replaceWith` パラメータは、可能な限り新しいAPIへの自動移行を提供するために使用すべきです。
*   非推奨のレベルは、APIを段階的に非推奨にするために使用すべきです。詳細については、[KotlinドキュメントのDeprecatedページ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)を参照してください。

一般的に、非推奨化はまず警告を生成し、次にエラーを生成し、その後宣言を隠すべきです。
このプロセスは、いくつかのマイナーリリースにわたって行われ、ユーザーがプロジェクトに必要な変更を行う時間を与えるべきです。
APIの削除などの破壊的な変更は、メジャーリリースでのみ行うべきです。
ライブラリは異なるバージョニングおよび非推奨化戦略を採用する場合がありますが、これは正しい期待を設定するためにユーザーに伝える必要があります。

詳細については、[Kotlin進化原則ドキュメント](kotlin-evolution-principles.md#libraries)またはKotlinConf 2023でのLeonid Startsevによる[クライアント向けにKotlin APIをスムーズに進化させる](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s)という講演を参照してください。

## RequiresOptInメカニズムを使用する

Kotlin標準ライブラリは、APIの一部を使用する前にユーザーからの明示的な同意を要求する[オプトインメカニズム](opt-in-requirements.md)を提供しています。
これは、それ自体が [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) でアノテーション付けされたマーカーアノテーションを作成することに基づいています。
特にライブラリに新しいAPIを導入する際には、ソース互換性および振る舞いの互換性に関する期待を管理するために、このメカニズムを使用すべきです。

このメカニズムを使用することを選択した場合、次のベストプラクティスに従うことをお勧めします。

*   オプトインメカニズムを使用して、APIの異なる部分に異なる保証を提供します。例えば、機能を _プレビュー_、 _実験的_、 _デリケート_ とマークすることができます。各カテゴリは、ドキュメントおよび[KDocコメント](kotlin-doc.md)で明確に説明し、適切な警告メッセージを含める必要があります。
*   ライブラリが実験的なAPIを使用している場合、[アノテーションを伝播](opt-in-requirements.md#propagate-opt-in-requirements)して、ユーザーが依存関係がまだ進化中であることを認識できるようにします。これにより、ユーザーは、あなたがまだ進化中の依存関係を持っていることを認識できます。
*   オプトインメカニズムを、ライブラリ内の既存の宣言を非推奨にするために使用することは避けてください。代わりに、[APIを実用的に進化させる](#evolve-apis-pragmatically)セクションで説明されているように、`@Deprecated` を使用してください。

## 次のステップ

まだの場合は、以下のページも確認してみてください。

*   [精神的複雑さを最小限に抑える](api-guidelines-minimizing-mental-complexity.md)ページで、精神的複雑さを最小限に抑える戦略を探ります。
*   効果的なドキュメンテーションの実践に関する詳細な概要については、[有益なドキュメンテーション](api-guidelines-informative-documentation.md)を参照してください。
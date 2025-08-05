[//]: # (title: Kotlin 1.3 の互換性ガイド)

_[言語のモダンさを維持する](kotlin-evolution-principles.md)_ と _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構成要素は削除されるべきだと述べており、後者は、コードの移行を可能な限りスムーズにするために、この削除が事前に十分に伝えられるべきだと述べています。

言語の変更点のほとんどは、アップデートの変更ログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントはそれらすべてを要約し、Kotlin 1.2 から Kotlin 1.3 への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

-   *ソース互換性*: ソース非互換の変更とは、これまで問題なく（エラーや警告なしに）コンパイルできていたコードが、コンパイルできなくなる変更です。
-   *バイナリ互換性*: 2つのバイナリ成果物がバイナリ互換であるとは、それらを交換してもロードエラーやリンクエラーが発生しない場合を指します。
-   *振る舞い互換性*: ある変更が振る舞い非互換であるとは、同じプログラムが変更適用前後で異なる振る舞いを示す場合を指します。

これらの定義は純粋なKotlinのみに与えられていることに注意してください。他の言語（例：Java）から見たKotlinコードの互換性は、このドキュメントの範囲外です。

## 非互換の変更

### コンストラクター引数の評価順序と `<clinit>` 呼び出し

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: クラスの初期化に関する評価順序が1.3で変更されます
>
> **Deprecation cycle**:
>
> -   1.3未満: 以前の振る舞い（詳細はIssueを参照）
> -   1.3以上: 振る舞いが変更されました
>     `-Xnormalize-constructor-calls=disable` を使用して、一時的に1.3以前の振る舞いに戻すことができます。このフラグのサポートは次期メジャーリリースで削除される予定です。

### アノテーションコンストラクターパラメーターに対するゲッターターゲットアノテーションの欠落

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: アノテーションのコンストラクターパラメーターに対するゲッターターゲットアノテーションは、1.3で適切にクラスファイルに書き込まれるようになります
>
> **Deprecation cycle**:
>
> -   1.3未満: アノテーションのコンストラクターパラメーターに対するゲッターターゲットアノテーションは適用されません
> -   1.3以上: アノテーションのコンストラクターパラメーターに対するゲッターターゲットアノテーションは適切に適用され、生成されたコードに書き込まれます

### クラスコンストラクターの `@get:` アノテーションにおけるエラーの欠落

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: ゲッターターゲットアノテーションのエラーは1.3で適切に報告されるようになります
>
> **Deprecation cycle**:
>
> -   1.2未満: ゲッターターゲットアノテーションのコンパイルエラーは報告されず、不正なコードが問題なくコンパイルされていました。
> -   1.2.x: エラーはツールのみによって報告され、コンパイラはそのようなコードを警告なしに引き続きコンパイルしていました。
> -   1.3以上: コンパイラによってもエラーが報告され、不正なコードは拒否されるようになります。

### `@NotNull` でアノテーションされたJava型へのアクセスにおけるNull許容性アサーション

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: 非nullアノテーションが付与されたJava型に対するnull許容性アサーションがより積極的に生成されるようになり、`null` を渡すコードがより早く失敗するようになります。
>
> **Deprecation cycle**:
>
> -   1.3未満: 型推論が関与する場合、コンパイラはそのようなアサーションを見落とす可能性があり、バイナリに対するコンパイル中に潜在的な `null` 伝播を許していました（詳細はIssueを参照）。
> -   1.3以上: コンパイラは見落とされていたアサーションを生成するようになります。これにより、これまで（誤って）`null`を渡していたコードがより早く失敗する可能性があります。 `-XXLanguage:-StrictJavaNullabilityAssertions` を使用して、一時的に1.3以前の振る舞いに戻すことができます。このフラグのサポートは次期メジャーリリースで削除される予定です。

### enumメンバーに対する不健全なスマートキャスト

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: 単一のenumエントリのメンバーに対するスマートキャストは、そのenumエントリにのみ正しく適用されるようになります
>
> **Deprecation cycle**:
>
> -   1.3未満: 単一のenumエントリのメンバーに対するスマートキャストが、他のenumエントリの同じメンバーに対する不健全なスマートキャストを引き起こす可能性がありました。
> -   1.3以上: スマートキャストは単一のenumエントリのメンバーにのみ適切に適用されるようになります。 `-XXLanguage:-SoundSmartcastForEnumEntries` は一時的に以前の振る舞いに戻します。このフラグのサポートは次期メジャーリリースで削除される予定です。

### ゲッターでの `val` バッキングフィールドの再割り当て

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: `val`プロパティのバッキングフィールドをゲッター内で再割り当てすることが禁止されます
>
> **Deprecation cycle**:
>
> -   1.2未満: Kotlinコンパイラは、`val`のバッキングフィールドをゲッター内で変更することを許可していました。これはKotlinのセマンティクスに違反するだけでなく、`final`フィールドを再割り当てする不正なJVMバイトコードを生成していました。
> -   1.2.X: `val`のバッキングフィールドを再割り当てするコードに対しては、非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### for-ループで反復される前に配列がキャプチャされること

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: forループの範囲内の式が、ループ本体で更新されるローカル変数である場合、この変更はループの実行に影響を与えます。これは、範囲、文字シーケンス、コレクションなどの他のコンテナを反復処理する場合と一貫性がありません。
>
> **Deprecation cycle**:
>
> -   1.2未満: 記述されたコードパターンは問題なくコンパイルされますが、ローカル変数の更新がループの実行に影響を与えます。
> -   1.2.X: forループの範囲式が、ループ本体で割り当てられる配列型のローカル変数である場合、非推奨の警告が報告されます。
> -   1.3: そのようなケースでの振る舞いを他のコンテナと一貫性のあるものに変更します。

### enumエントリ内のネストされた分類子

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、enumエントリ内のネストされた分類子（クラス、オブジェクト、インターフェース、アノテーションクラス、enumクラス）は禁止されます
>
> **Deprecation cycle**:
>
> -   1.2未満: enumエントリ内のネストされた分類子は問題なくコンパイルされますが、実行時に例外で失敗する可能性があります。
> -   1.2.X: ネストされた分類子に対して非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### データクラスによる `copy` のオーバーライド

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、データクラスが `copy()` をオーバーライドすることは禁止されます
>
> **Deprecation cycle**:
>
> -   1.2未満: `copy()` をオーバーライドするデータクラスは問題なくコンパイルされますが、実行時に失敗したり、奇妙な振る舞いをしたりする可能性があります。
> -   1.2.X: `copy()` をオーバーライドするデータクラスに対して非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### `Throwable` を継承し、外側のクラスからジェネリックパラメータをキャプチャするインナークラス

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、インナークラスが `Throwable` を継承することは許可されません
>
> **Deprecation cycle**:
>
> -   1.2未満: `Throwable` を継承するインナークラスは問題なくコンパイルされていました。もしそのようなインナークラスがジェネリックパラメータをキャプチャすると、実行時に失敗する奇妙なコードパターンにつながる可能性がありました。
> -   1.2.X: `Throwable` を継承するインナークラスに対して非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### コンパニオンオブジェクトを含む複雑なクラス階層に関する可視性ルール

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、コンパニオンオブジェクトとネストされた分類子を含む複雑なクラス階層において、短い名前による可視性ルールがより厳格になります。
>
> **Deprecation cycle**:
>
> -   1.2未満: 以前の可視性ルール（詳細はIssueを参照）
> -   1.2.X: アクセスできなくなる短い名前に対して非推奨の警告が報告されます。ツールは完全な名前を追加することによる自動移行を提案します。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。問題のあるコードには、完全な修飾子または明示的なインポートを追加する必要があります。

### 非定数の `vararg` アノテーションパラメータ

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、非定数値をvarargアノテーションパラメータとして設定することは禁止されます
>
> **Deprecation cycle**:
>
> -   1.2未満: コンパイラはvarargアノテーションパラメータに非定数値を渡すことを許可していましたが、バイトコード生成時にその値を実際には破棄し、非自明な振る舞いにつながっていました。
> -   1.2.X: そのようなコードパターンに対して非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### ローカルアノテーションクラス

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、ローカルアノテーションクラスはサポートされません
>
> **Deprecation cycle**:
>
> -   1.2未満: コンパイラはローカルアノテーションクラスを問題なくコンパイルしていました。
> -   1.2.X: ローカルアノテーションクラスに対して非推奨の警告が報告されます。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### ローカル委譲プロパティに対するスマートキャスト

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、ローカル委譲プロパティに対するスマートキャストは許可されません
>
> **Deprecation cycle**:
>
> -   1.2未満: コンパイラはローカル委譲プロパティのスマートキャストを許可しており、これは不正な振る舞いをするデリゲートの場合に不健全なスマートキャストにつながる可能性がありました。
> -   1.2.X: ローカル委譲プロパティに対するスマートキャストは非推奨として報告されます（コンパイラが警告を発します）。
> -   1.3以上: 非推奨の警告がエラーに格上げされます。

### mod 演算子規約

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、`mod`演算子の宣言、およびそのような宣言に解決される呼び出しは禁止されます
>
> **Deprecation cycle**:
>
> -   1.1.X, 1.2.X: `operator mod`の宣言、およびそれに解決される呼び出しに対して警告が報告されます。
> -   1.3.X: 警告はエラーに格上げされますが、`operator mod`宣言への解決は引き続き許可されます。
> -   1.4.X: `operator mod`への呼び出しはもはや解決されなくなります。

### 単一要素を名前付き形式で `vararg` に渡すこと

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). See also [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3では、単一要素をvarargに割り当てることは非推奨となり、連続したスプレッドと配列構築に置き換える必要があります。
>
> **Deprecation cycle**:
>
> -   1.2未満: 名前付き形式で単一の値をvararg要素に割り当てることは問題なくコンパイルされ、*単一*要素を配列に割り当てるものとして扱われるため、配列をvarargに割り当てる際に非自明な振る舞いを引き起こしていました。
> -   1.2.X: そのような割り当てに対して非推奨の警告が報告され、ユーザーは連続したスプレッドと配列構築に切り替えることを推奨されます。
> -   1.3.X: 警告がエラーに格上げされます。
> -   1.4以上: 単一要素をvarargに割り当てるセマンティクスを変更し、配列の割り当てを配列のスプレッドの割り当てと同等にします。

### ターゲット `EXPRESSION` を持つアノテーションのリテンション

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、`EXPRESSION`ターゲットを持つアノテーションには`SOURCE`リテンションのみが許可されます
>
> **Deprecation cycle**:
>
> -   1.2未満: ターゲット`EXPRESSION`で`SOURCE`以外のリテンションを持つアノテーションは許可されていましたが、使用箇所では黙って無視されていました。
> -   1.2.X: そのようなアノテーションの宣言に対して非推奨の警告が報告されます。
> -   1.3以上: 警告がエラーに格上げされます。

### ターゲット `PARAMETER` を持つアノテーションはパラメータの型に適用されるべきではない

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.3以降、`PARAMETER`ターゲットを持つアノテーションがパラメーターの型に適用された場合、誤ったアノテーションターゲットに関するエラーが適切に報告されるようになります
>
> **Deprecation cycle**:
>
> -   1.2未満: 上述のコードパターンは問題なくコンパイルされ、アノテーションは黙って無視され、バイトコードには存在しませんでした。
> -   1.2.X: そのような使用法に対して非推奨の警告が報告されます。
> -   1.3以上: 警告がエラーに格上げされます。

### `Array.copyOfRange` は、返される配列を拡張する代わりに、インデックスが範囲外の場合に例外をスローする

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Kotlin 1.3以降、`Array.copyOfRange`の`toIndex`引数（コピーされる範囲の排他的終端を表す）が配列サイズよりも大きくないことを確認し、大きい場合は`IllegalArgumentException`をスローするようになります。
>
> **Deprecation cycle**:
>
> -   1.3未満: `Array.copyOfRange`の呼び出しにおける`toIndex`が配列サイズよりも大きい場合、範囲内の不足している要素は`null`で埋められ、Kotlinの型システムの健全性を損なっていました。
> -   1.3以上: `toIndex`が配列の範囲内にあることを確認し、そうでない場合は例外をスローします。

### `Int.MIN_VALUE` および `Long.MIN_VALUE` をステップとする整数および長整数型進行は禁止され、インスタンス化できなくなる

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Kotlin 1.3以降、整数進行のステップ値がその整数型（`Long`または`Int`）の最小負値となることを禁止し、`IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)`を呼び出すと`IllegalArgumentException`がスローされるようになります。
>
> **Deprecation cycle**:
>
> -   1.3未満: `Int.MIN_VALUE`のステップで`IntProgression`を作成することが可能で、これは`[0, -2147483648]`という2つの値を生成し、非自明な振る舞いでした。
> -   1.3以上: ステップがその整数型の最小負値である場合、`IllegalArgumentException`をスローします。

### 非常に長いシーケンスに対する操作でのインデックスオーバーフローのチェック

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Kotlin 1.3以降、`index`、`count`、および類似のメソッドが非常に長いシーケンスでオーバーフローしないことを確認します。影響を受けるメソッドの完全なリストについてはIssueを参照してください。
>
> **Deprecation cycle**:
>
> -   1.3未満: 非常に長いシーケンスでそのようなメソッドを呼び出すと、整数オーバーフローにより負の結果が生じる可能性がありました。
> -   1.3以上: そのようなメソッドでのオーバーフローを検出し、すぐに例外をスローします。

### 空のマッチ正規表現による `split` 結果のプラットフォーム間での統一

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Kotlin 1.3以降、空のマッチ正規表現による`split`メソッドの振る舞いをすべてのプラットフォームで統一します
>
> **Deprecation cycle**:
>
> -   1.3未満: 記述された呼び出しの振る舞いは、JS、JRE 6、JRE 7とJRE 8+を比較すると異なっていました。
> -   1.3以上: プラットフォーム間で振る舞いを統一します。

### コンパイラ配布物内の非推奨成果物の提供終了

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: その他
>
> **Incompatible change type**: バイナリ
>
> **Short summary**: Kotlin 1.3では、以下の非推奨のバイナリ成果物のサポートを終了します。
>
> -   `kotlin-runtime`: 代わりに`kotlin-stdlib`を使用してください。
> -   `kotlin-stdlib-jre7/8`: 代わりに`kotlin-stdlib-jdk7/8`を使用してください。
> -   コンパイラ配布物内の`kotlin-jslib`: 代わりに`kotlin-stdlib-js`を使用してください。
>
> **Deprecation cycle**:
>
> -   1.2.X: これらの成果物は非推奨としてマークされており、コンパイラはそれらの成果物の使用に対して警告を報告していました。
> -   1.3以上: これらの成果物のサポートは終了されます。

### stdlib内アノテーション

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: バイナリ
>
> **Short summary**: Kotlin 1.3では、`org.jetbrains.annotations`パッケージのアノテーションがstdlibから削除され、コンパイラに同梱される別の成果物である`annotations-13.0.jar`と`mutability-annotations-compat.jar`に移動されます。
>
> **Deprecation cycle**:
>
> -   1.3未満: アノテーションはstdlib成果物と共に提供されていました。
> -   1.3以上: アノテーションは別の成果物で提供されます。
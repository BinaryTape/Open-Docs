---
title: "Kotlin 1.3 の互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行をできる限りスムーズにするために、この削除は事前に十分に伝えられるべきであるとしています。

言語の変更のほとんどは、更新履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてを要約し、Kotlin 1.2からKotlin 1.3への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性を紹介します。

- *Source* (ソース): ソース互換性のない変更とは、(エラーや警告なしに) 正常にコンパイルされていたコードがコンパイルできなくなることです。
- *Binary* (バイナリ): 2つのバイナリ成果物がバイナリ互換であるとは、それらを交換しても、ロードまたはリンクのエラーが発生しない場合をいいます。
- *Behavioral* (動作): 変更が動作互換性がないとは、あるプログラムが、変更を適用する前と後で異なる動作を示す場合をいいます。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。
Kotlinコードの他の言語の視点 (例えば、Javaから) からの互換性は、このドキュメントの範囲外です。

## 互換性のない変更

### &lt;clinit&gt; 呼び出しに関するコンストラクタ引数の評価順序

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: クラスの初期化に関する評価順序が1.3で変更されました
>
> **Deprecation cycle**: 
>
> - &lt;1.3: 古い動作 (詳細はIssueを参照)
> - &gt;= 1.3: 動作が変更されました。
> `-Xnormalize-constructor-calls=disable` を使用すると、一時的に1.3より前の動作に戻すことができます。このフラグのサポートは、次のメジャーリリースで削除される予定です。

### アノテーションコンストラクタパラメータにgetterを対象としたアノテーションがない

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: アノテーションコンストラクタパラメータのgetterを対象としたアノテーションは、1.3でクラスファイルに正しく書き込まれます
>
> **Deprecation cycle**: 
>
> - &lt;1.3: アノテーションコンストラクタパラメータのgetterを対象としたアノテーションは適用されません
> - &gt;=1.3: アノテーションコンストラクタパラメータのgetterを対象としたアノテーションは正しく適用され、生成されたコードに書き込まれます

### クラスコンストラクタの @get: アノテーションのエラーがない

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: getterを対象としたアノテーションのエラーは、1.3で正しく報告されます
>
> **Deprecation cycle**:
>
> - &lt;1.2: getterを対象としたアノテーションのコンパイルエラーは報告されず、不正なコードが正常にコンパイルされていました。
> - 1.2.x: エラーはツールによってのみ報告され、コンパイラは警告なしにそのようなコードをコンパイルします
> - &gt;=1.3: エラーはコンパイラによっても報告され、誤ったコードは拒否されます

### @NotNull でアノテーションされた Java 型へのアクセスに対する Nullability assertions

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: not-null アノテーションでアノテーションされた Java 型の nullability assertions は、より積極的に生成されるようになり、ここで `null` を渡すコードはより早く失敗します。
>
> **Deprecation cycle**:
>
> - &lt;1.3: 型推論が関係している場合、コンパイラはそのような assertions を見逃す可能性があり、バイナリに対してコンパイル中に潜在的な `null` 伝播を許可していました (詳細はIssueを参照)。
> - &gt;=1.3: コンパイラは見逃した assertions を生成します。これにより、(誤って) ここに `null` を渡していたコードはより早く失敗する可能性があります。
> `-XXLanguage:-StrictJavaNullabilityAssertions` を使用すると、一時的に1.3より前の動作に戻すことができます。このフラグのサポートは、次のメジャーリリースで削除される予定です。

### enum メンバに対する不健全なスマートキャスト

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: 1つの enum エントリのメンバに対するスマートキャストは、この enum エントリにのみ正しく適用されます
>
> **Deprecation cycle**:
>
> - &lt;1.3: 1つの enum エントリのメンバに対するスマートキャストは、他の enum エントリの同じメンバに対する不健全なスマートキャストにつながる可能性がありました。
> - &gt;=1.3: スマートキャストは、1つの enum エントリのメンバにのみ正しく適用されます。
> `-XXLanguage:-SoundSmartcastForEnumEntries` は、一時的に古い動作に戻します。このフラグのサポートは、次のメジャーリリースで削除される予定です。

### getter での val backing field の再代入

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: getter での `val` プロパティの backing field の再代入は禁止されるようになりました
>
> **Deprecation cycle**:
>
> - &lt;1.2: Kotlin コンパイラは、getter で `val` の backing field を変更することを許可していました。これは Kotlin のセマンティクスに違反するだけでなく、`final` フィールドを再代入する不正な JVM バイトコードを生成します。
> - 1.2.X: `val` の backing field を再代入するコードで、非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### 反復処理される for ループの前の配列キャプチャ

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Source
>
> **Short summary**: for ループ範囲の式がループ本体で更新されるローカル変数の場合、この変更はループの実行に影響を与えます。これは、範囲、文字列、コレクションなどの他のコンテナの反復処理と一致しません。
>
> **Deprecation cycle**:
> 
> - &lt;1.2: 記述されたコードパターンは正常にコンパイルされますが、ローカル変数への更新はループの実行に影響を与えます
> - 1.2.X: for ループの範囲式が、ループ本体で代入される配列型のローカル変数の場合、非推奨の警告が報告されます
> - 1.3: そのような場合の動作を、他のコンテナと一貫性があるように変更します

### enum エントリのネストされた classifiers

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、enum エントリのネストされた classifiers (クラス、オブジェクト、インターフェース、アノテーションクラス、enum クラス) は禁止されています
>
> **Deprecation cycle**:
>
> - &lt;1.2: enum エントリのネストされた classifiers は正常にコンパイルされますが、実行時に例外が発生する可能性があります
> - 1.2.X: ネストされた classifiers で非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### データクラスの copy のオーバーライド

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、データクラスは `copy()` をオーバーライドすることが禁止されています
>
> **Deprecation cycle**:
>
> - &lt;1.2: `copy()` をオーバーライドするデータクラスは正常にコンパイルされますが、実行時に失敗したり、奇妙な動作を示す可能性があります
> - 1.2.X: `copy()` をオーバーライドするデータクラスで非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### 外側のクラスからジェネリックパラメータをキャプチャする Throwable を継承する内部クラス

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、内部クラスは `Throwable` を継承することは許可されていません
>
> **Deprecation cycle**:
>
> - &lt;1.2: `Throwable` を継承する内部クラスは正常にコンパイルされます。そのような内部クラスがジェネリックパラメータをキャプチャする場合、実行時に失敗する奇妙なコードパターンにつながる可能性があります。
> - 1.2.X: `Throwable` を継承する内部クラスで非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### コンパニオンオブジェクトを含む複雑なクラス階層に関する可視性ルール

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、コンパニオンオブジェクトとネストされた classifiers を含む複雑なクラス階層の場合、短い名前による可視性のルールはより厳密になります。
>
> **Deprecation cycle**:
>
> - &lt;1.2: 古い可視性ルール (詳細はIssueを参照)
> - 1.2.X: アクセスできなくなる短い名前で非推奨の警告が報告されます。ツールは、完全な名前を追加することで自動移行を提案します。
> - &gt;=1.3: 非推奨の警告はエラーに昇格します。問題のあるコードは、完全な修飾子または明示的なインポートを追加する必要があります

### 非定数の vararg アノテーションパラメータ

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、非定数値を vararg アノテーションパラメータとして設定することは禁止されています
>
> **Deprecation cycle**:
>
> - &lt;1.2: コンパイラは、vararg アノテーションパラメータに非定数値を渡すことを許可していますが、実際にはバイトコード生成中にその値をドロップし、不明確な動作につながります
> - 1.2.X: そのようなコードパターンで非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### ローカルアノテーションクラス

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、ローカルアノテーションクラスはサポートされていません
>
> **Deprecation cycle**:
>
> - &lt;1.2: コンパイラはローカルアノテーションクラスを正常にコンパイルしました
> - 1.2.X: ローカルアノテーションクラスで非推奨の警告が報告されます
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### ローカル delegated プロパティのスマートキャスト

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、ローカル delegated プロパティのスマートキャストは許可されていません
>
> **Deprecation cycle**:
>
> - &lt;1.2: コンパイラはローカル delegated プロパティをスマートキャストすることを許可していましたが、不正な delegate の場合、不健全なスマートキャストにつながる可能性がありました
> - 1.2.X: ローカル delegated プロパティのスマートキャストは非推奨として報告されます (コンパイラは警告を発行します)
> - &gt;=1.3: 非推奨の警告はエラーに昇格します

### mod 演算子の規約

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、`mod` 演算子の宣言、およびそのような宣言に解決される呼び出しは禁止されています
>
> **Deprecation cycle**:
>
> - 1.1.X, 1.2.X: `operator mod` の宣言、およびそれに解決される呼び出しで警告を報告します
> - 1.3.X: 警告をエラーに昇格させますが、`operator mod` 宣言への解決は引き続き許可します
> - 1.4.X: `operator mod` への呼び出しはもう解決しません

### 名前付き形式での vararg への単一要素の渡し

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). See also [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3では、vararg への単一要素の代入は非推奨となり、連続する spread と配列構築に置き換える必要があります。
>
> **Deprecation cycle**:
>
> - &lt;1.2: 名前付き形式で vararg に1つの値を代入すると、正常にコンパイルされ、配列への *単一* 要素の代入として扱われ、vararg に配列を代入するときに不明確な動作が発生します
> - 1.2.X: そのような代入で非推奨の警告が報告され、連続する spread と配列構築に切り替えるように推奨されます
> - 1.3.X: 警告はエラーに昇格します
> - &gt;= 1.4: vararg への単一要素の代入のセマンティクスを変更し、配列の代入を配列の spread の代入と同等にします

### ターゲット EXPRESSION を持つアノテーションの保持

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、ターゲット `EXPRESSION` を持つアノテーションでは、`SOURCE` 保持のみが許可されます
>
> **Deprecation cycle**:
>
> - &lt;1.2: ターゲット `EXPRESSION` と `SOURCE` 以外の保持を持つアノテーションは許可されていますが、使用箇所では暗黙的に無視されます
> - 1.2.X: そのようなアノテーションの宣言で非推奨の警告が報告されます
> - &gt;=1.3: 警告はエラーに昇格します

### ターゲット PARAMETER を持つアノテーションは、パラメータの型に適用可能であってはなりません

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3以降、ターゲット `PARAMETER` を持つアノテーションがパラメータの型に適用される場合、間違ったアノテーションターゲットに関するエラーが正しく報告されます
>
> **Deprecation cycle**:
>
> - &lt;1.2: 前述のコードパターンは正常にコンパイルされます。アノテーションは暗黙的に無視され、バイトコードには存在しません
> - 1.2.X: そのような使用法で非推奨の警告が報告されます
> - &gt;=1.3: 警告はエラーに昇格します

### Array.copyOfRange は、返される配列を拡大する代わりに、インデックスが範囲外の場合に例外をスローします

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3以降、コピーされる範囲の排他的な末尾を表す `Array.copyOfRange` の `toIndex` 引数が配列サイズを超えていないことを確認し、超えている場合は `IllegalArgumentException` をスローします。
>
> **Deprecation cycle**:
>
> - &lt;1.3: `Array.copyOfRange` の呼び出しで `toIndex` が配列サイズよりも大きい場合、範囲内の不足している要素は `null` で埋められ、Kotlin 型システムの健全性が損なわれます。
> - &gt;=1.3: `toIndex` が配列の範囲内にあることを確認し、そうでない場合は例外をスローします

### Int.MIN_VALUE および Long.MIN_VALUE のステップを持つ int および long の Progression は禁止されており、インスタンス化することはできません

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3以降、整数 Progression のステップ値が、その整数型の最小負の値 (`Long` または `Int`) であることを禁止します。そのため、`IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` を呼び出すと `IllegalArgumentException` がスローされます。
>
> **Deprecation cycle**:
>
> - &lt;1.3: `Int.MIN_VALUE` ステップで `IntProgression` を作成することができ、2つの値 `[0, -2147483648]` が生成されます。これは不明確な動作です
> - &gt;=1.3: ステップがその整数型の最小負の値である場合、`IllegalArgumentException` をスローします

### 非常に長いシーケンスに対する操作でのインデックスオーバーフローのチェック

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3以降、`index`、`count` などのメソッドが長いシーケンスでオーバーフローしないようにします。影響を受けるメソッドの完全なリストについては、Issueを参照してください。
>
> **Deprecation cycle**:
>
> - &lt;1.3: 非常に長いシーケンスでそのようなメソッドを呼び出すと、整数のオーバーフローにより負の結果が生成される可能性があります
> - &gt;=1.3: そのようなメソッドでオーバーフローを検出し、すぐに例外をスローします

### プラットフォーム間で空の一致 regex 結果による分割を統一します

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3以降、すべてのプラットフォームで空の一致 regex による `split` メソッドの動作を統一します
>
> **Deprecation cycle**:
>
> - &lt;1.3: 記述された呼び出しの動作は、JS、JRE 6、JRE 7 と JRE 8+ を比較すると異なります
> - &gt;=1.3: プラットフォーム間で動作を統一します

### コンパイラディストリビューションで非推奨になった成果物を廃止しました

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: other
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3では、次の非推奨のバイナリ成果物を廃止します。
> - `kotlin-runtime`: 代わりに `kotlin-stdlib` を使用します
> - `kotlin-stdlib-jre7/8`: 代わりに `kotlin-stdlib-jdk7/8` を使用します
> - コンパイラディストリビューションの `kotlin-jslib`: 代わりに `kotlin-stdlib-js` を使用します
>
> **Deprecation cycle**:
>
> - 1.2.X: 成果物は非推奨としてマークされ、コンパイラはそれらの成果物の使用に関する警告を報告しました
> - &gt;=1.3: 成果物は廃止されました

### stdlib のアノテーション

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3では、`org.jetbrains.annotations` パッケージのアノテーションを stdlib から削除し、コンパイラとともに配布される個別の成果物 (`annotations-13.0.jar` および `mutability-annotations-compat.jar`) に移動します
>
> **Deprecation cycle**:
>
> - &lt;1.3: アノテーションは stdlib 成果物とともに配布されました
> - &gt;=1.3: アノテーションは個別の成果物で配布されます
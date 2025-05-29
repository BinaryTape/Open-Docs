[//]: # (title: Kotlin 1.6 の互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ ことと _[快適な更新](kotlin-evolution-principles.md)_ は、Kotlin 言語設計における基本的な原則に含まれています。前者は、言語の進化を妨げる構文は削除されるべきであると述べており、後者は、コードの移行を可能な限りスムーズにするために、この削除が事前に十分伝達されるべきであると述べています。

ほとんどの言語変更は、更新の変更ログやコンパイラの警告など、他のチャネルですでに発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 1.5 から Kotlin 1.6 への移行のための完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース互換性_: ソース非互換な変更とは、以前は問題なくコンパイルできていたコード（エラーや警告なし）がコンパイルできなくなる変更を指します。
- _バイナリ互換性_: 2つのバイナリ成果物がバイナリ互換性があるとは、それらを入れ替えてもロードエラーやリンクエラーが発生しないことを指します。
- _動作互換性_: 変更が動作非互換であるとは、同じプログラムが変更適用前後で異なる動作を示すことを指します。

これらの定義は純粋なKotlinのみに適用されることを覚えておいてください。他の言語の観点からのKotlinコードの互換性（例えばJavaからの互換性）はこのドキュメントの範囲外です。

## 言語

### `enum`、`sealed`、および`Boolean`を対象とする`when`ステートメントをデフォルトで網羅的にする

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`enum`、`sealed`、または`Boolean`を対象とする`when`ステートメントが非網羅的である場合に警告を発します。
>
> **非推奨サイクル**:
>
> - 1.6.0: `enum`、`sealed`、または`Boolean`を対象とする`when`ステートメントが非網羅的である場合に警告を導入（プログレッシブモードではエラー）
> - 1.7.0: この警告をエラーに昇格

### 主語付き`when`での紛らわしい文法を非推奨にする

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`when`条件式におけるいくつかの紛らわしい文法構造を非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.6.20: 影響を受ける式に対して非推奨警告を導入
> - 1.8.0: この警告をエラーに昇格
> - `>= 1.8`: いくつかの非推奨の構文を新しい言語機能のために再利用

### コンパニオンオブジェクトおよびネストされたオブジェクトのスーパーコンストラクタ呼び出しにおけるクラスメンバへのアクセスを禁止

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、コンパニオンオブジェクトおよび通常のオブジェクトのスーパーコンストラクタ呼び出しの引数について、その引数のレシーバが包含する宣言を参照している場合にエラーを報告します。
>
> **非推奨サイクル**:
>
> - 1.5.20: 問題のある引数に対して警告を導入
> - 1.6.0: この警告をエラーに昇格
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects` を使用すると、一時的に1.6以前の動作に戻すことができます。

### 型のnull許容性強化の改善

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、Javaコードにおける型のnull許容性アノテーションのロードと解釈方法を変更します。
>
> **非推奨サイクル**:
>
> - 1.4.30: より厳密な型のnull許容性がエラーにつながる可能性があるケースについて警告を導入
> - 1.7.0: Java型のnull許容性をより厳密に推論
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` を使用すると、一時的に1.7以前の動作に戻すことができます。

### 異なる数値型間の暗黙的な型変換を禁止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: 動作
>
> **概要**: Kotlin は、意味的にその型へのダウンキャストのみが必要な場合、数値が自動的にプリミティブ数値型に変換されることを避けます。
>
> **非推奨サイクル**:
>
> - `< 1.5.30`: 影響を受けるすべてのケースでの古い動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャスト動作を修正
>   `-Xuse-old-backend` を使用すると、一時的に1.5.30以前の修正動作に戻すことができます。
> - `>= 1.6.20`: 他の影響を受けるケースにおけるダウンキャスト動作を修正

### コンテナアノテーションがJLSに違反する繰り返し可能なアノテーションクラスの宣言を禁止

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、繰り返し可能なアノテーションのコンテナアノテーションが[JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3)の要件（配列型の値メソッド、保持ポリシー、ターゲット）を満たしているかどうかを確認します。
>
> **非推奨サイクル**:
>
> - 1.5.30: JLS要件に違反する繰り返し可能なコンテナアノテーションの宣言に対して警告を導入（プログレッシブモードではエラー）
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` を使用すると、一時的にエラー報告を無効にすることができます。

### 繰り返し可能なアノテーションクラス内での`Container`という名前のネストされたクラスの宣言を禁止

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、Kotlinで宣言された繰り返し可能なアノテーションに、事前定義された名前`Container`を持つネストされたクラスがないことを確認します。
>
> **非推奨サイクル**:
>
> - 1.5.30: Kotlinの繰り返し可能なアノテーションクラスにおける`Container`という名前のネストされたクラスに対して警告を導入（プログレッシブモードではエラー）
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` を使用すると、一時的にエラー報告を無効にすることができます。

### プライマリコンストラクタ内のインターフェースプロパティをオーバーライドするプロパティに対する`@JvmField`の使用を禁止

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、プライマリコンストラクタ内で宣言され、インターフェースプロパティをオーバーライドするプロパティに`@JvmField`アノテーションを付与することを禁止します。
>
> **非推奨サイクル**:
>
> - 1.5.20: プライマリコンストラクタ内のそのようなプロパティに対する`@JvmField`アノテーションについて警告を導入
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` を使用すると、一時的にエラー報告を無効にすることができます。

### コンパイラオプション`-Xjvm-default`の`enable`モードと`compatibility`モードを非推奨にする

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6.20 では、`-Xjvm-default`コンパイラオプションの`enable`モードと`compatibility`モードの使用について警告を発します。
>
> **非推奨サイクル**:
>
> - 1.6.20: `-Xjvm-default`コンパイラオプションの`enable`モードと`compatibility`モードについて警告を導入
> - `>= 1.8.0`: この警告をエラーに昇格

### public-abiインライン関数からの`super`呼び出しを禁止

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、publicまたはprotectedなインライン関数およびプロパティから`super`修飾子を持つ関数を呼び出すことを禁止します。
>
> **非推奨サイクル**:
>
> - 1.5.0: publicまたはprotectedなインライン関数またはプロパティアクセサからの`super`呼び出しについて警告を導入
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline` を使用すると、一時的にエラー報告を無効にすることができます。

### publicインライン関数からのprotectedコンストラクタ呼び出しを禁止

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、publicまたはprotectedなインライン関数およびプロパティからprotectedコンストラクタを呼び出すことを禁止します。
>
> **非推奨サイクル**:
>
> - 1.4.30: publicまたはprotectedなインライン関数またはプロパティアクセサからのprotectedコンストラクタ呼び出しについて警告を導入
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` を使用すると、一時的にエラー報告を無効にすることができます。

### ファイルプライベート型からのプライベートなネストされた型の公開を禁止

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、ファイルプライベート型からのプライベートなネストされた型およびインナークラスの公開を禁止します。
>
> **非推奨サイクル**:
>
> - 1.5.0: ファイルプライベート型から公開されるプライベート型について警告を導入
> - 1.6.0: この警告をエラーに昇格
>   `-XXLanguage:-PrivateInFileEffectiveVisibility` を使用すると、一時的にエラー報告を無効にすることができます。

### 型に対するアノテーションのターゲットがいくつかのケースで分析されない

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、型に適用すべきではないアノテーションを型に付与することを許可しなくなります。
>
> **非推奨サイクル**:
>
> - 1.5.20: プログレッシブモードでエラーを導入
> - 1.6.0: エラーを導入
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` を使用すると、一時的にエラー報告を無効にすることができます。

### 末尾ラムダを持つ`suspend`という名前の関数への呼び出しを禁止

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **コンポーネント**: コア言語
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、関数型である単一の引数が末尾ラムダとして渡される`suspend`という名前の関数を呼び出すことを許可しなくなります。
>
> **非推奨サイクル**:
>
> - 1.3.0: そのような関数呼び出しについて警告を導入
> - 1.6.0: この警告をエラーに昇格
> - `>= 1.7.0`: 言語文法に変更を導入し、`{`の前の`suspend`がキーワードとしてパースされるようにする

## 標準ライブラリ

### `minus`/`removeAll`/`retainAll`における脆弱な`contains`最適化の削除

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換な変更の種類**: 動作
>
> **概要**: Kotlin 1.6 では、コレクション/イテラブル/配列/シーケンスから複数の要素を削除する関数および演算子の引数に対して、Setへの変換を実行しなくなります。
>
> **非推奨サイクル**:
>
> - `< 1.6`: 古い動作: 引数が特定のケースでSetに変換される
> - 1.6.0: 関数の引数がコレクションの場合、`Set`には変換されなくなります。コレクションではない場合、代わりに`List`に変換されることがあります。
>   JVMでは、システムプロパティ`kotlin.collections.convert_arg_to_set_in_removeAll=true`を設定することで、古い動作を一時的に戻すことができます。
> - `>= 1.7`: 上記のシステムプロパティは効果がなくなります。

### `Random.nextLong`における値生成アルゴリズムの変更

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換な変更の種類**: 動作
>
> **概要**: Kotlin 1.6 では、指定された範囲外の値が生成されるのを避けるために、`Random.nextLong`関数の値生成アルゴリズムを変更します。
>
> **非推奨サイクル**:
>
> - 1.6.0: 動作が直ちに修正されます。

### コレクションの`min`および`max`関数の戻り値を段階的に非null許容型に変更

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、コレクションの`min`および`max`関数の戻り型が非null許容型に変更されます。
>
> **非推奨サイクル**:
>
> - 1.4.0: 同義語として`...OrNull`関数を導入し、影響を受けるAPIを非推奨にする（詳細についてはIssueを参照）
> - 1.5.0: 影響を受けるAPIの非推奨レベルをエラーに昇格
> - 1.6.0: 非推奨の関数をパブリックAPIから非表示にする
> - `>= 1.7`: 影響を受けるAPIを再導入するが、戻り型は非null許容型にする

### 浮動小数点配列関数 `contains`、`indexOf`、`lastIndexOf` を非推奨にする

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換な変更の種類**: ソース
>
> **概要**: Kotlin では、全順序ではなくIEEE-754順序を使用して値を比較する浮動小数点配列関数`contains`、`indexOf`、`lastIndexOf`を非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.4.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.6.0: 非推奨レベルをエラーに昇格
> - `>= 1.7`: 非推奨の関数をパブリックAPIから非表示にする

### `kotlin.dom`および`kotlin.browser`パッケージの宣言を`kotlinx.*`に移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: ソース
>
> **概要**: `kotlin.dom`および`kotlin.browser`パッケージの宣言が、標準ライブラリからの抽出に備えて、対応する`kotlinx.*`パッケージに移動されます。
>
> **非推奨サイクル**:
>
> - 1.4.0: `kotlinx.dom`および`kotlinx.browser`パッケージに代替APIを導入
> - 1.4.0: `kotlin.dom`および`kotlin.browser`パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案
> - 1.6.0: 非推奨レベルをエラーに昇格
> - `>= 1.7`: 標準ライブラリから非推奨の関数を削除
> - `>= 1.7`: `kotlinx.*`パッケージのAPIを別のライブラリに移動

### Kotlin/JSにおいて`Regex.replace`関数をインラインにしない

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: ソース
>
> **概要**: 関数型`transform`パラメータを持つ`Regex.replace`関数は、Kotlin/JSではインラインではなくなります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 影響を受ける関数から`inline`修飾子を削除

### 置換文字列にグループ参照が含まれる場合のJVMとJSにおける`Regex.replace`関数の異なる動作

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: 動作
>
> **概要**: Kotlin/JSの`Regex.replace`関数は、置換パターン文字列について、Kotlin/JVMと同じパターンの構文に従うようになります。
>
> **非推奨サイクル**:
>
> - 1.6.0: Kotlin/JSの標準ライブラリにおける`Regex.replace`の置換パターン処理を変更

### JSの正規表現でUnicodeケースフォールディングを使用

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: 動作
>
> **概要**: Kotlin/JSの`Regex`クラスは、基盤となるJS正規表現エンジンを呼び出してUnicodeルールに従って文字を検索および比較する際に、[`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)フラグを使用するようになります。
> これにより、JS環境に特定のバージョン要件が発生し、正規表現パターン文字列における不要なエスケープの検証がより厳格になります。
>
> **非推奨サイクル**:
>
> - 1.5.0: JSの`Regex`クラスのほとんどの関数でUnicodeケースフォールディングを有効にする
> - 1.6.0: `Regex.replaceFirst`関数でUnicodeケースフォールディングを有効にする

### 一部のJS専用APIを非推奨にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: ソース
>
> **概要**: 標準ライブラリ内の一部のJS専用関数が削除のために非推奨になります。これらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の`sort`関数（例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)が含まれます。
>
> **非推奨サイクル**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.7.0: 非推奨レベルをエラーに昇格
> - 1.8.0: 非推奨の関数をパブリックAPIから削除

### Kotlin/JSのクラスのパブリックAPIから、実装および相互運用に特化した関数を非表示にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換な変更の種類**: ソース、バイナリ
>
> **概要**: 関数`HashMap.createEntrySet`と`AbstactMutableCollection.toJSON`の可視性が`internal`に変更されます。
>
> **非推奨サイクル**:
>
> - 1.6.0: 関数を`internal`にし、パブリックAPIから削除します。

## ツール

### `KotlinGradleSubplugin`クラスを非推奨にする

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: `KotlinGradleSubplugin`クラスは`KotlinCompilerPluginSupportPlugin`に置き換えられて非推奨になります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 非推奨レベルをエラーに昇格
> - `>= 1.7.0`: 非推奨のクラスを削除

### `kotlin.useFallbackCompilerSearch`ビルドオプションを削除

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: 非推奨の`kotlin.useFallbackCompilerSearch`ビルドオプションを削除します。
>
> **非推奨サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に昇格
> - 1.6.0: 非推奨のオプションを削除

### いくつかのコンパイラオプションを削除

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: 非推奨の`noReflect`および`includeRuntime`コンパイラオプションを削除します。
>
> **非推奨サイクル**:
>
> - 1.5.0: 非推奨レベルをエラーに昇格
> - 1.6.0: 非推奨のオプションを削除

### `useIR`コンパイラオプションを非推奨にする

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: 非推奨の`useIR`コンパイラオプションを非表示にします。
>
> **非推奨サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に昇格
> - 1.6.0: オプションを非表示にする
> - `>= 1.7.0`: 非推奨のオプションを削除

### `kapt.use.worker.api` Gradleプロパティを非推奨にする

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: Gradle Workers API経由でkaptを実行することを許可する`kapt.use.worker.api`プロパティ（デフォルト: true）を非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に昇格
> - `>= 1.8.0`: このプロパティを削除

### `kotlin.parallel.tasks.in.project` Gradleプロパティを削除

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: `kotlin.parallel.tasks.in.project`プロパティを削除します。
>
> **非推奨サイクル**:
>
> - 1.5.20: 非推奨レベルを警告に昇格
> - 1.6.20: このプロパティを削除

### `kotlin.experimental.coroutines` Gradle DSLオプションと`kotlin.coroutines` Gradleプロパティを非推奨にする

> **Issue**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **コンポーネント**: Gradle
>
> **非互換な変更の種類**: ソース
>
> **概要**: `kotlin.experimental.coroutines` Gradle DSLオプションと`kotlin.coroutines`プロパティを非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に昇格
> - `>= 1.7.0`: DSLオプションとプロパティを削除
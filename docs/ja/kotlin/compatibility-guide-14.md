[//]: # (title: Kotlin 1.4.x 互換性ガイド)

_[言語の現代性を保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構文を削除すべきであると述べ、後者は、コード移行を可能な限りスムーズにするために、この削除が事前に十分に伝達されるべきであると述べています。

ほとんどの言語変更は、更新履歴やコンパイラ警告などの他のチャネルを通じて既に発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 1.3 から Kotlin 1.4 への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_: ソース互換性のない変更により、以前は（エラーや警告なしで）正常にコンパイルできていたコードが、コンパイルできなくなります。
- _binary_: 2つのバイナリアーティファクトは、それらを相互に入れ替えてもロードエラーやリンクエラーを引き起こさない場合、バイナリ互換性があると言われます。
- _behavioral_: 変更適用前後で同じプログラムが異なる振る舞いを示す場合、その変更は動作互換性のない変更であると言われます。

これらの定義は純粋なKotlinに対してのみ与えられていることを覚えておいてください。他の言語（例えばJava）の視点から見たKotlinコードの互換性は、このドキュメントの範囲外です。

## 言語と標準ライブラリ

### `in` 演算子と `ConcurrentHashMap` による予期しない動作

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、Java で記述された `java.util.Map` の実装から来る自動的な `contains` 演算子を禁止します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 問題のある演算子に対して呼び出しサイトで警告を導入
> - >= 1.4: この警告をエラーに昇格
>  `-XXLanguage:-ProhibitConcurrentHashMapContains` を使用して一時的に1.4より前の動作に戻すことができます。

### `public inline` メンバー内での `protected` メンバーへのアクセスを禁止

> **Issue**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、`public inline` メンバーからの `protected` メンバーへのアクセスを禁止します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 問題のあるケースに対して呼び出しサイトで警告を導入
> - 1.4: この警告をエラーに昇格
>  `-XXLanguage:-ProhibitProtectedCallFromInline` を使用して一時的に1.4より前の動作に戻すことができます。

### 暗黙的なレシーバーを持つ呼び出しにおけるコントラクト

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: 1.4 では、コントラクトからのスマートキャストが暗黙的なレシーバーを持つ呼び出しで利用可能になります。
> 
> **Deprecation cycle**: 
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
>  `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` を使用して一時的に1.4より前の動作に戻すことができます。

### 浮動小数点数比較の一貫性のない動作

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、Kotlin コンパイラは浮動小数点数の比較に IEEE 754 標準を使用します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
>  `-XXLanguage:-ProperIeee754Comparisons` を使用して一時的に1.4より前の動作に戻すことができます。

### ジェネリックラムダの最後の式におけるスマートキャストなし

> **Issue**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: 1.4 以降、ラムダ内の最後の式に対するスマートキャストが正しく適用されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### ラムダ引数の順序に依存して結果を `Unit` に強制しない

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、ラムダ引数は `Unit` への暗黙的な強制なしに独立して解決されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### raw型と整数リテラル型間の誤った共通スーパータイプが不健全なコードにつながる

> **Issue**: [KT-35681](https://youtrack.com/issue/KT-35681)
> 
> **Components**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、rawな `Comparable` 型と整数リテラル型間の共通スーパータイプがより特定されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 複数の等しい型変数が異なる型でインスタンス化されることによる型安全性の問題

> **Issue**: [KT-35679](https://youtrack.com/issue/KT-35679)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、Kotlin コンパイラは等しい型変数を異なる型でインスタンス化することを禁止します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 交差型に対する不正なサブタイピングによる型安全性の問題

> **Issues**: [KT-22474](https://youtrack.com/issue/KT-22474)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、交差型に対するサブタイピングがより正しく動作するように洗練されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### ラムダ内の空の `when` 式での型の不一致がない

> **Issue**: [KT-17995](https://youtrack.com/issue/KT-17995)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、空の `when` 式がラムダの最後の式として使用された場合、型の不一致が発生します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 複数の戻り値の可能性を持つラムダにおける早期リターンを伴う整数リテラルに対する `Any` 型推論

> **Issue**: [KT-20226](https://youtrack.com/issue/KT-20226)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、早期リターンがある場合のラムダから返される整数型がより特定されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 再帰型を持つスタープロジェクションの適切なキャプチャ

> **Issue**: [KT-33012](https://youtrack.com/issue/KT-33012)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、再帰型に対するキャプチャがより正しく動作するため、より多くの候補が適用可能になります。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 不適切な型と柔軟な型での共通スーパータイプ計算が誤った結果につながる

> **Issue**: [KT-37054](https://youtrack.com/issue/KT-37054)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、柔軟な型間の共通スーパータイプがより特定され、ランタイムエラーから保護されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### Null許容型引数に対するキャプチャされた変換の不足による型安全性の問題

> **Issue**: [KT-35487](https://youtrack.com/issue/KT-35487)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、キャプチャされた型とNull許容型の間のサブタイピングがより正しくなり、ランタイムエラーから保護されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### uncheckedキャスト後の共変型の交差型を保持する
 
> **Issue**: [KT-37280](https://youtrack.com/issue/KT-37280)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、共変型の unchecked キャストは、スマートキャストに対して unchecked キャストの型ではなく、交差型を生成します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### `this` 式の使用によるビルダ推論からの型変数リーク
 
> **Issue**: [KT-32126](https://youtrack.com/issue/KT-32126)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、`sequence {}` のようなビルダ関数内で `this` を使用することは、他の適切な制約がない場合に禁止されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### Null許容型引数を持つ反変型の誤ったオーバーロード解決
 
> **Issue**: [KT-31670](https://youtrack.com/issue/KT-31670)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、反変型引数を取る関数の2つのオーバーロードが、型のNull許容性（例: `In<T>` と `In<T?>`）のみで異なる場合、Null許容型がより特定されるとみなされます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### ネストされていない再帰制約を持つビルダ推論
 
> **Issue**: [KT-34975](https://youtrack.com/issue/KT-34975)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、渡されたラムダ内の再帰制約に依存する型を持つ `sequence {}` のようなビルダ関数は、コンパイラエラーを引き起こします。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### 熱心な型変数固定が矛盾する制約システムにつながる
 
> **Issue**: [KT-25175](https://youtrack.com/issue/KT-25175)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、特定のケースにおける型推論はより熱心に動作しなくなり、矛盾しない制約システムを見つけることができます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
> `-XXLanguage:-NewInference` を使用して一時的に1.4より前の動作に戻すことができます。このフラグはいくつかの新しい言語機能も無効にする点に注意してください。

### `open` 関数での `tailrec` 修飾子の禁止

> **Issue**: [KT-18541](https://youtrack.com/issue/KT-18541)
> 
> **Component**: コア言語
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、関数は `open` と `tailrec` 修飾子を同時に持つことはできません。
> 
> **Deprecation cycle**:
> 
> - < 1.4: `open` と `tailrec` 修飾子を同時に持つ関数に対して警告を報告（プログレッシブモードではエラー）。
> - >= 1.4: この警告をエラーに昇格。

### コンパニオンオブジェクトクラス自体よりも可視性の高いコンパニオンオブジェクトの `INSTANCE` フィールド

> **Issue**: [KT-11567](https://youtrack.com/issue/KT-11567)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、コンパニオンオブジェクトがプライベートの場合、その `INSTANCE` フィールドもプライベートになります。
> 
> **Deprecation cycle**:
> 
> - < 1.4: コンパイラは非推奨フラグ付きで `INSTANCE` オブジェクトを生成します。
> - >= 1.4: コンパニオンオブジェクトの `INSTANCE` フィールドは適切な可視性を持ちます。

### 戻り値の前に挿入された外側の `finally` ブロックが、`finally` のない内側の `try` ブロックの `catch` 区間から除外されない

> **Issue**: [KT-31923](https://youtrack.com/issue/KT-31923)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、ネストされた `try/catch` ブロックに対して `catch` 区間が適切に計算されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
>  `-XXLanguage:-ProperFinally` を使用して一時的に1.4より前の動作に戻すことができます。

### 共変およびジェネリックス特殊化されたオーバーライドの戻り値の型位置でインラインクラスのボックス化されたバージョンを使用する

> **Issues**: [KT-30419](https://youtrack.com/issue/KT-30419)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、共変およびジェネリックス特殊化されたオーバーライドを使用する関数は、インラインクラスのボックス化された値を返します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### Kotlinインターフェースへの委譲を使用する場合、JVMバイトコードでチェック済み例外を宣言しない

> **Issue**: [KT-35834](https://youtrack.com/issue/KT-35834)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、Kotlinインターフェースへの委譲中にチェック済み例外を生成しません。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
>  `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` を使用して一時的に1.4より前の動作に戻すことができます。

### 単一の `vararg` パラメータを持つメソッドへのシグネチャポリモーフィック呼び出しの動作変更により、引数が別の配列にラップされるのを回避する

> **Issue**: [KT-35469](https://youtrack.com/issue/KT-35469)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、シグネチャポリモーフィック呼び出しで引数を別の配列にラップしません。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### `KClass` がジェネリックパラメータとして使用される場合のアノテーションにおける不正なジェネリックシグネチャ

> **Issue**: [KT-35207](https://youtrack.com/issue/KT-35207)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、`KClass` がジェネリックパラメータとして使用される場合のアノテーションにおける不正な型マッピングを修正します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### シグネチャポリモーフィック呼び出しでのスプレッド演算子の禁止

> **Issue**: [KT-35226](https://youtrack.com/issue/KT-35226)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 では、シグネチャポリモーフィック呼び出しでのスプレッド演算子 (`*`) の使用を禁止します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: シグネチャポリモーフィック呼び出しでのスプレッド演算子の使用について警告を報告
> - >= 1.5: この警告をエラーに昇格
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` を使用して一時的に1.4より前の動作に戻すことができます。

### 末尾再帰最適化された関数のデフォルト値の初期化順序を変更

> **Issue**: [KT-31540](https://youtrack.com/issue/KT-31540)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、末尾再帰関数の初期化順序は通常の関数と同じになります。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 問題のある関数に対して宣言サイトで警告を報告
> - >= 1.4: 動作変更
>  `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` を使用して一時的に1.4より前の動作に戻すことができます。

### 非 `const` な `val` に対して `ConstantValue` 属性を生成しない

> **Issue**: [KT-16615](https://youtrack.com/issue/KT-16615)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、コンパイラは非 `const` な `val` に対して `ConstantValue` 属性を生成しません。
> 
> **Deprecation cycle**:
> 
> - < 1.4: IntelliJ IDEAインスペクションを通じて警告を報告
> - >= 1.4: 動作変更
>  `-XXLanguage:-NoConstantValueAttributeForNonConstVals` を使用して一時的に1.4より前の動作に戻すことができます。

### `open` メソッド上の `@JvmOverloads` のために生成されるオーバーロードは `final` にすべき

> **Issue**: [KT-33240](https://youtrack.com/issue/KT-33240)
> 
> **Components**: Kotlin/JVM
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: `@JvmOverloads` を持つ関数のオーバーロードは `final` として生成されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更
>  `-XXLanguage:-GenerateJvmOverloadsAsFinal` を使用して一時的に1.4より前の動作に戻すことができます。

### `kotlin.Result` を返すラムダは、アンボックス化された値ではなくボックス化された値を返すようになる

> **Issue**: [KT-39198](https://youtrack.com/issue/KT-39198)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、`kotlin.Result` 型の値を返すラムダは、アンボックス化された値ではなくボックス化された値を返します。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### nullチェックからの例外を統一する

> **Issue**: [KT-22275](https://youtrack.com/issue/KT-22275)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、すべてのランタイムnullチェックは `java.lang.NullPointerException` をスローします。
> 
> **Deprecation cycle**:
> 
> - < 1.4: ランタイムnullチェックは、`KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException`、`TypeCastException` など、異なる例外をスローします。
> - >= 1.4: すべてのランタイムnullチェックは `java.lang.NullPointerException` をスローします。
>   `-Xno-unified-null-checks` を使用して一時的に1.4より前の動作に戻すことができます。

### 配列/リスト操作 (`contains`, `indexOf`, `lastIndexOf`) における浮動小数点値の比較: IEEE 754または全順序

> **Issue**: [KT-28753](https://youtrack.com/issue/KT-28753)
> 
> **Component**: `kotlin-stdlib` (JVM)
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: `Double/FloatArray.asList()` から返される `List` 実装は、`contains`、`indexOf`、`lastIndexOf` を実装し、それらが全順序の等価性を使用するようにします。
> 
> **Deprecation cycle**: 
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### コレクションの `min` および `max` 関数の戻り値の型を徐々に非nullableに変更する

> **Issue**: [KT-38854](https://youtrack.com/issue/KT-38854)
> 
> **Component**: `kotlin-stdlib` (JVM)
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: コレクションの `min` および `max` 関数の戻り値の型は 1.6 で非nullableに変更されます。
> 
> **Deprecation cycle**:
> 
> - 1.4: 同義語として `...OrNull` 関数を導入し、影響を受けるAPIを非推奨にする（詳細はIssueを参照）
> - 1.5.x: 影響を受けるAPIの非推奨レベルをエラーに昇格
> - >=1.6: 影響を受けるAPIを非nullableな戻り値の型で再導入

### `appendln` を非推奨にし、`appendLine` を推奨する

> **Issue**: [KT-38754](https://youtrack.com/issue/KT-38754)
> 
> **Component**: `kotlin-stdlib` (JVM)
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: `StringBuilder.appendln()` は非推奨になり、`StringBuilder.appendLine()` が推奨されます。
> 
> **Deprecation cycle**:
> 
> - 1.4: `appendln` の代替として `appendLine` 関数を導入し、`appendln` を非推奨にする
> - >=1.5: 非推奨レベルをエラーに昇格

### 浮動小数点型から `Short` および `Byte` への変換を非推奨にする

> **Issue**: [KT-30360](https://youtrack.com/issue/KT-30360)
> 
> **Component**: `kotlin-stdlib` (JVM)
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、浮動小数点型から `Short` および `Byte` への変換は非推奨になります。
> 
> **Deprecation cycle**:
> 
> - 1.4: `Double.toShort()/toByte()` および `Float.toShort()/toByte()` を非推奨にし、代替を提案
> - >=1.5: 非推奨レベルをエラーに昇格

### 無効な `startIndex` に対する `Regex.findAll` での早期失敗

> **Issue**: [KT-28356](https://youtrack.com/issue/KT-28356)
> 
> **Component**: `kotlin-stdlib`
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Kotlin 1.4 以降、`findAll` は `startIndex` が `findAll` に入る時点で入力文字シーケンスの有効な位置インデックスの範囲内にあることを確認するように改善され、そうでない場合は `IndexOutOfBoundsException` をスローします。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### 非推奨の `kotlin.coroutines.experimental` の削除

> **Issue**: [KT-36083](https://youtrack.com/issue/KT-36083)
> 
> **Component**: `kotlin-stdlib`
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、非推奨の `kotlin.coroutines.experimental` API は標準ライブラリから削除されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: `kotlin.coroutines.experimental` は `ERROR` レベルで非推奨。
> - >= 1.4: `kotlin.coroutines.experimental` は標準ライブラリから削除されます。JVM では、別途互換性アーティファクトが提供されます（詳細はIssueを参照）。

### 非推奨の `mod` 演算子の削除

> **Issue**: [KT-26654](https://youtrack.com/issue/KT-26654)
> 
> **Component**: `kotlin-stdlib`
> 
> **Incompatible change type**: ソース
> 
> **Short summary**: Kotlin 1.4 以降、数値型に対する `mod` 演算子は標準ライブラリから削除されます。
> 
> **Deprecation cycle**:
> 
> - < 1.4: `mod` は `ERROR` レベルで非推奨。
> - >= 1.4: `mod` は標準ライブラリから削除されます。

### `Throwable.addSuppressed` メンバーを非表示にし、代わりに拡張関数を優先する

> **Issue**: [KT-38777](https://youtrack.com/issue/KT-38777)
> 
> **Component**: `kotlin-stdlib`
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: `Throwable.addSuppressed()` 拡張関数が `Throwable.addSuppressed()` メンバー関数よりも優先されるようになりました。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 従来の動作（詳細はIssueを参照）
> - >= 1.4: 動作変更

### `capitalize` は二重音字をタイトルケースに変換すべき

> **Issue**: [KT-38817](https://youtrack.com/issue/KT-38817)
> 
> **Component**: `kotlin-stdlib`
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: `String.capitalize()` 関数は、[セルビア・クロアチア語のガジュのラテン文字](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) の二重音字をタイトルケース（`ǅ` ではなく `Ǆ`）で大文字にします。
> 
> **Deprecation cycle**:
> 
> - < 1.4: 二重音字は大文字（`Ǆ`）で大文字化されます。
> - >= 1.4: 二重音字はタイトルケース（`ǅ`）で大文字化されます。

## ツール

### Windows では、区切り文字を含むコンパイラ引数を二重引用符で渡す必要があります

> **Issue**: [KT-41309](https://youtrack.com/issue/KT-41309)
> 
> **Component**: CLI
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: Windows では、区切り文字（空白、`=`、`;`、`,`）を含む `kotlinc.bat` 引数には二重引用符（`"`）が必要です。
> 
> **Deprecation cycle**:
> 
> - < 1.4: すべてのコンパイラ引数は引用符なしで渡されます。
> - >= 1.4: 区切り文字（空白、`=`、`;`、`,`）を含むコンパイラ引数には二重引用符（`"`）が必要です。

### KAPT: プロパティに対する合成 `$annotations()` メソッドの名前が変更されました

> **Issue**: [KT-36926](https://youtrack.com/issue/KT-36926)
> 
> **Component**: KAPT
> 
> **Incompatible change type**: 動作
> 
> **Short summary**: KAPT によってプロパティに対して生成される合成 `$annotations()` メソッドの名前が 1.4 で変更されました。
> 
> **Deprecation cycle**:
> 
> - < 1.4: プロパティに対する合成 `$annotations()` メソッドの名前は `<propertyName>@annotations()` テンプレートに従います。
> - >= 1.4: プロパティに対する合成 `$annotations()` メソッドの名前には `get` プレフィックス (`get<PropertyName>@annotations()`) が含まれます。
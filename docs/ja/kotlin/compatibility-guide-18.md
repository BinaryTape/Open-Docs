---
title: "Kotlin 1.8 の互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行をできるだけスムーズにするために、この削除は事前に十分に告知されるべきであるとしています。

言語の変更のほとんどは、アップデートの変更ログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらをすべてまとめ、Kotlin 1.7からKotlin 1.8への移行のための完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース互換性）：ソース非互換な変更とは、これまで（エラーや警告なしに）問題なくコンパイルできていたコードがコンパイルできなくなる変更を指します。
- _binary_（バイナリ互換性）：2つのバイナリ成果物を相互に交換しても、ロードまたはリンケージエラーが発生しない場合、それらはバイナリ互換であると言えます。
- _behavioral_（動作互換性）：変更を適用する前と後で、同じプログラムが異なる動作を示す場合、その変更は動作非互換であると言えます。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。Kotlinコードの他の言語からの互換性（たとえば、Javaから）は、このドキュメントの範囲外です。

## 言語

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### スーパークラスの抽象メンバーへのスーパーコールの委譲を禁止する

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: Kotlinは、明示的または暗黙的なスーパーコールが、スーパークラスの_abstract_（抽象）メンバーに委譲される場合に、コンパイルエラーを報告します。これは、スーパーインターフェースにデフォルト実装がある場合でも同様です。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用された場合に警告を表示します。
> - 1.7.0: スーパーコールが、実際にはスーパークラスの抽象メンバーにアクセスする場合に警告を報告します。
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換モードが有効になっている場合は、影響を受けるすべてのケースでエラーを報告します。
>   progressive mode（段階的モード）でエラーを報告します。
> - 1.8.0: スーパークラスからオーバーライドされていない抽象メソッドを持つ具象クラスを宣言する場合、および`Any`メソッドのスーパーコールがスーパークラスで抽象としてオーバーライドされる場合にエラーを報告します。
> - 1.9.0: スーパークラスの抽象メソッドへの明示的なスーパーコールを含む、影響を受けるすべてのケースでエラーを報告します。

### when-with-subjectの紛らわしい文法を非推奨にする

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、`when`条件式におけるいくつかの紛らわしい文法構造が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式にdeprecation warning（非推奨警告）を表示します。
> - 1.8.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` を使用すると、一時的に1.8より前の動作に戻すことができます。
> - &gt;= 1.9: いくつかの非推奨の構造を新しい言語機能のために再利用します。

### 異なる数値型間の暗黙的な型変換を防止する

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlinは、セマンティクス的にその型へのダウンキャストのみが必要な場合に、数値の値を自動的にプリミティブ数値型に変換することを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべてのケースで古い動作をします。
> - 1.5.30: 生成されたプロパティデリゲートアクセサーでダウンキャストの動作を修正します。
>   `-Xuse-old-backend` を使用すると、一時的に1.5.30より前の修正動作に戻すことができます。
> - &gt;= 1.9: 他の影響を受けるケースでダウンキャストの動作を修正します。

### sealed class（封印されたクラス）のprivate（プライベート）コンストラクタを真にprivateにする

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: sealed class（封印されたクラス）の継承クラスをプロジェクト構造のどこで宣言できるかの制限を緩和した後、sealed class（封印されたクラス）のコンストラクタのデフォルトの可視性はprotectedになりました。
> ただし、1.8までは、Kotlinはsealed class（封印されたクラス）の明示的に宣言されたprivateコンストラクタを、それらのクラスのスコープ外から呼び出すことを許可していました。
>
> **Deprecation cycle**:
>
> - 1.6.20: sealed class（封印されたクラス）のprivateコンストラクタが、そのクラスの外部から呼び出された場合に警告（またはprogressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: privateコンストラクタのデフォルトの可視性ルールを使用します（privateコンストラクタの呼び出しは、その呼び出しが対応するクラス内にある場合にのみ解決できます）。
>   古い動作は、`-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses`コンパイラ引数を指定することで一時的に戻すことができます。

### builder inference（ビルダー推論）のコンテキストで、互換性のない数値型に対する演算子 == の使用を禁止する

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、builder inference（ビルダー推論）のラムダ関数のスコープ内で、`Int`や`Long`などの互換性のない数値型に対して演算子 `==` を使用することを禁止します。これは、現在他のコンテキストで行われているのと同じです。
>
> **Deprecation cycle**:
>
> - 1.6.20: 演算子 `==` が互換性のない数値型で使用された場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` を使用すると、一時的に1.8より前の動作に戻すことができます。

### elvis operator（エルビス演算子）の右辺でelseなしのifと網羅的でないwhenを禁止する

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、網羅的でない`when`または`else`ブランチのない`if`式を、Elvis operator（エルビス演算子）（`?:`）の右辺で使用することを禁止します。
> 以前は、Elvis operator（エルビス演算子）の結果が式として使用されていなかった場合は許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: このような網羅的でないifおよびwhen式で警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` を使用すると、一時的に1.8より前の動作に戻すことができます。

### ジェネリックな type alias（型エイリアス）の使用における upper bound（上限）違反を禁止する (エイリアス型の複数の型引数で使用される1つの型パラメータ)

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、エイリアス型の対応する型パラメータの upper bound（上限）の制約に違反する型引数を持つ type alias（型エイリアス）の使用を禁止します。これは、1つの typealias（型エイリアス）の型パラメータがエイリアス型の複数の型引数で使用される場合です。たとえば、`typealias Alias<T> = Base<T, T>`などです。
>
> **Deprecation cycle**:
>
> - 1.7.0: エイリアス型の対応する型パラメータの upper bound（上限）の制約に違反する型引数を持つ type alias（型エイリアス）の使用について警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: この警告をエラーに昇格させます。
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` を使用すると、一時的に1.8より前の動作に戻すことができます。

### ジェネリックな type alias（型エイリアス）の使用における upper bound（上限）違反を禁止する (エイリアス型の型引数のジェネリック型引数で使用される型パラメータ)

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、エイリアス型の対応する型パラメータの upper bound（上限）の制約に違反する型引数を持つ type alias（型エイリアス）の使用を禁止します。これは、typealias（型エイリアス）の型パラメータがエイリアス型の型引数のジェネリック型引数として使用される場合です。たとえば、`typealias Alias<T> = Base<List<T>>`などです。
>
> **Deprecation cycle**:
>
> - 1.8.0: ジェネリックな typealias（型エイリアス）の使用に、エイリアス型の対応する型パラメータの upper bound（上限）の制約に違反する型引数がある場合に警告を報告します。
> - &gt;=1.10: 警告をエラーに昇格させます。

### 拡張プロパティのために宣言された型パラメータをデリゲート内で使用することを禁止する

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、ジェネリック型での拡張プロパティを、受信側の型パラメータを安全でない方法で使用するジェネリック型に委譲することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 拡張プロパティを、委譲されたプロパティの型引数から推論された型パラメータを特定の方法で使用する型に委譲する場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: 警告をエラーに昇格させます。
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` を使用すると、一時的に1.8より前の動作に戻すことができます。

### suspend（中断）関数での @Synchronized アノテーションを禁止する

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、`@Synchronized`アノテーションをsuspend（中断）関数に配置することを禁止します。これは、中断呼び出しがsynchronized（同期化）されたブロック内で発生することを許可すべきではないためです。
>
> **Deprecation cycle**:
>
> - 1.6.0: `@Synchronized`アノテーションでアノテーションが付けられたsuspend（中断）関数で警告を報告します。
>    progressive mode（段階的モード）では、警告はエラーとして報告されます。
> - 1.8.0: 警告をエラーに昇格させます。
>    `-XXLanguage:-SynchronizedSuspendError` を使用すると、一時的に1.8より前の動作に戻すことができます。

### spread operator（スプレッド演算子）を使用して引数を非varargパラメータに渡すことを禁止する

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、特定の条件下で、spread operator（スプレッド演算子）（`*`）を使用して配列を非vararg配列パラメータに渡すことを許可していました。Kotlin 1.8以降、これは禁止されます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 非vararg配列パラメータが予期される場所でspread operator（スプレッド演算子）を使用する場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` を使用すると、一時的に1.8より前の動作に戻すことができます。

### ラムダの戻り値の型でオーバーロードされた関数に渡されるラムダでのnull-safety（null安全性）違反を禁止する

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、オーバーロードがnullableな戻り値の型を許可しない場合に、それらのラムダの戻り値の型でオーバーロードされた関数に渡されるラムダから`null`を返すことを禁止します。
> 以前は、`null`が`when`演算子のいずれかのブランチから返された場合は許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 型の不一致の警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.8.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` を使用すると、一時的に1.8より前の動作に戻すことができます。

### パブリックシグネチャでローカル型を近似するときにnull許容を保持する

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: ローカル型または匿名型が明示的に指定された戻り値の型を持たない式本体関数から返される場合、Kotlinコンパイラはその型の既知のスーパータイプを使用して戻り値の型を推論（または近似）します。
> この間、コンパイラは、実際にはnull値が返される可能性がある場合に、non-nullable型を推論する可能性があります。
>
> **Deprecation cycle**:
>
> - 1.8.0: 柔軟な型を柔軟なスーパータイプで近似します。
> - 1.8.0: 宣言がnullableであるはずのnon-nullable型を持つように推論される場合に警告を報告し、ユーザーに型を明示的に指定するように促します。
> - 1.9.0: nullableな型をnullableなスーパータイプで近似します。
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` を使用すると、一時的に1.9より前の動作に戻すことができます。

### オーバーライドを通じて非推奨を伝播しない

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、スーパークラスの非推奨メンバーからサブクラスのオーバーライドされたメンバーへの非推奨の伝播は行われなくなります。これにより、スーパークラスのメンバーを非推奨にしつつ、サブクラスでは非推奨のままにしないための明示的なメカニズムが提供されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来の動作変更のメッセージと、この警告を抑制するか、非推奨メンバーのオーバーライドに`@Deprecated`アノテーションを明示的に記述するかのいずれかを促す警告を報告します。
> - 1.9.0: オーバーライドされたメンバーへの非推奨ステータスの伝播を停止します。この変更は progressive mode（段階的モード）でもすぐに有効になります。

### builder inference（ビルダー推論）のコンテキストで型変数を upper bound（上限）に暗黙的に推論することを禁止する

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、builder inference（ビルダー推論）のラムダ関数のスコープ内で、使用箇所の型情報がない場合に、型変数を対応する型パラメータの upper bound（上限）に推論することを禁止します。これは、現在他のコンテキストで行われているのと同じです。
>
> **Deprecation cycle**:
>
> - 1.7.20: 使用箇所の型情報がない場合に、型パラメータが宣言された upper bound（上限）に推論されるときに警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` を使用すると、一時的に1.9より前の動作に戻すことができます。

### アノテーションクラスで、collection literal（コレクションリテラル）をパラメータの宣言以外の場所で使用することを禁止する

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinでは、collection literal（コレクションリテラル）の使用は制限されており、アノテーションクラスのパラメータに配列を渡すか、これらのパラメータのデフォルト値を指定するために使用できます。
> しかしそれ以外にも、Kotlinではcollection literal（コレクションリテラル）をアノテーションクラス内の他の場所、たとえばネストされたオブジェクトで使用することができました。Kotlin 1.9では、collection literal（コレクションリテラル）をアノテーションクラスで、パラメータのデフォルト値以外の場所で使用することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: アノテーションクラスのネストされたオブジェクト内の配列リテラルで警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。

### デフォルト値の式で、デフォルト値を持つパラメータへの前方参照を禁止する

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、他のパラメータのデフォルト値の式で、デフォルト値を持つパラメータへの前方参照を禁止します。これにより、パラメータがデフォルト値の式でアクセスされるまでに、関数に渡されるか、独自のデフォルト値の式によって初期化されるかのいずれかによって、すでに値を持っていることが保証されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: デフォルト値を持つパラメータが、その前に来る別のパラメータのデフォルト値で参照される場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` を使用すると、一時的に1.9より前の動作に戻すことができます。

### インライン関数パラメータでの拡張呼び出しを禁止する

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinはインライン関数パラメータを別のインライン関数にレシーバーとして渡すことを許可していましたが、そのようなコードをコンパイルすると常にコンパイラの例外が発生しました。
> Kotlin 1.9ではこれを禁止し、コンパイラがクラッシュする代わりにエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.7.20: インライン関数パラメータでのインライン拡張呼び出しに対して警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。

### 無名関数引数を持つ suspend という名前の infix 関数への呼び出しを禁止する

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、関数型として渡される単一の引数を持つ`suspend`という名前のinfix関数を、匿名関数リテラルとして呼び出すことを許可しません。
>
> **Deprecation cycle**:
>
> - 1.7.20: 匿名関数リテラルを使用した suspend infix 呼び出しで警告を報告します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError` を使用すると、一時的に1.9より前の動作に戻すことができます。
> - &gt;=1.10: パーサーによる `suspend fun` トークンシーケンスの解釈方法を変更します。

### 内部クラスでキャプチャされた型パラメータをそのバリアンスに対して使用することを禁止する

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、`in`または`out`バリアンスを持つ外部クラスの型パラメータを、その型パラメータの宣言されたバリアンスに違反する位置にあるそのクラスの内部クラスで使用することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 外部クラスの型パラメータの使用位置が、そのパラメータのバリアンスルールに違反する場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` を使用すると、一時的に1.9より前の動作に戻すことができます。

### 複合代入演算子で明示的な戻り値の型がない関数の再帰呼び出しを禁止する

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、現在その関数の本体内の他の式で行っているように、明示的に指定された戻り値の型がない関数を、その関数の本体内の複合代入演算子の引数で呼び出すことを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 明示的に指定された戻り値の型がない関数が、複合代入演算子引数内のその関数の本体内で再帰的に呼び出される場合に警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。

### 予期される @NotNull T と指定された Kotlin ジェネリックパラメータ (null 許容バインド付き) を使用した健全でない呼び出しを禁止する

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、潜在的にnull許容のジェネリック型の値が、Javaメソッドの`@NotNull`アノテーションが付けられたパラメータに渡されるメソッド呼び出しを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 制約のないジェネリック型パラメータが、non-nullable型が予期される場所に渡される場合に警告を報告します。
> - 1.9.0: 上記の警告の代わりに型の不一致エラーを報告します。
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` を使用すると、一時的に1.8より前の動作に戻すことができます。

### この列挙型の列挙エントリ初期化子から、列挙クラスのコンパニオンオブジェクトのメンバーへのアクセスを禁止する

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、列挙エントリ初期化子からの列挙型のコンパニオンオブジェクトへのあらゆる種類のアクセスを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのようなコンパニオンメンバーアクセスで警告（または progressive mode（段階的モード）ではエラー）を報告します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` を使用すると、一時的に1.8より前の動作に戻すことができます。

### Enum.declaringClass 合成プロパティを非推奨にして削除する

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinでは、基になるJavaクラス `java.lang.Enum` のメソッド `getDeclaringClass()` から生成された `Enum` 値で、合成プロパティ `declaringClass` を使用することができました。ただし、このメソッドはKotlin `Enum` 型では利用できません。Kotlin 1.9ではこのプロパティの使用を禁止し、代わりに拡張プロパティ `declaringJavaClass` への移行を提案します。
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` プロパティの使用で警告（または progressive mode（段階的モード）ではエラー）を報告し、`declaringJavaClass` 拡張への移行を提案します。
> - 1.9.0: 警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitEnumDeclaringClass` を使用すると、一時的に1.9より前の動作に戻すことができます。
> - &gt;=1.10: `declaringClass` 合成プロパティを削除します。

### コンパイラオプション -Xjvm-default の enable モードと compatibility モードを非推奨にする

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 では、`-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードの使用について警告します。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードで警告を表示します。
> - &gt;= 1.9: この警告をエラーに昇格させます。

## 標準ライブラリ

### Range/Progression が Collection を実装し始めるときに、オーバーロード解決の潜在的な変更について警告する

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、標準のプログレッションとそこから継承された具象範囲で `Collection` インターフェースを実装することが計画されています。これにより、メソッドのオーバーロードが2つある場合（1つは要素を受け入れ、もう1つはコレクションを受け入れる）、オーバーロード解決で別のオーバーロードが選択される可能性があります。
> Kotlinは、このようなオーバーロードされたメソッドが範囲またはプログレッション引数で呼び出された場合に、警告またはエラーを報告することで、この状況を可視化します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 標準のプログレッションまたはその範囲の継承オブジェクトを引数としてオーバーロードされたメソッドが呼び出された場合に警告を報告します。
>   このプログレッション/範囲が `Collection` インターフェースを実装すると、将来この呼び出しで別のオーバーロードが選択される場合に限ります。
> - 1.8.0: この警告をエラーに昇格させます。
> - 1.9.0: エラーの報告を停止し、プログレッションで `Collection` インターフェースを実装して、影響を受けるケースでオーバーロード解決の結果を変更します。

### kotlin.dom パッケージおよび kotlin.browser パッケージから kotlinx.* への宣言を移行する

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` パッケージおよび `kotlin.browser` パッケージからの宣言は、stdlib から抽出する準備として、対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` パッケージおよび `kotlinx.browser` パッケージに代替APIを導入します。
> - 1.4.0: `kotlin.dom` パッケージおよび `kotlin.browser` パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案します。
> - 1.6.0: 非推奨レベルをエラーに引き上げます。
> - 1.8.20: JS-IRターゲットのstdlibから非推奨の関数を削除します。
> - &gt;= 1.9: kotlinx.* パッケージのAPIを個別のライブラリに移動します。

### 一部の JS 専用 API を非推奨にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib の多数の JS 専用関数が、削除のために非推奨になっています。これには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数が含まれます。たとえば、`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)` などです。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にします。
> - 1.9.0: 非推奨レベルをエラーに引き上げます。
> - &gt;=1.10.0: 非推奨の関数をパブリックAPIから削除します。

## ツール

### KotlinCompileタスクのclasspathプロパティの非推奨レベルを引き上げる

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` タスクの `classpath` プロパティは非推奨です。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` プロパティは非推奨になりました。
> - 1.8.0: 非推奨レベルをエラーに引き上げます。
> - &gt;=1.9.0: 非推奨の関数をパブリックAPIから削除します。

### kapt.use.worker.api Gradleプロパティを削除する

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Gradle Workers API経由
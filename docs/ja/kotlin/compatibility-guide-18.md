[//]: # (title: Kotlin 1.8.x 互換性ガイド)

『[言語をモダンに保つ](kotlin-evolution-principles.md)』および『[快適なアップデート](kotlin-evolution-principles.md)』は、Kotlin 言語設計の基本原則です。前者は言語の進化を妨げる構造は削除されるべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、その削除は事前によく周知されるべきであることを示しています。

ほとんどの言語変更は、アップデートの変更ログやコンパイラの警告などの他のチャネルを通じて既に発表されていますが、このドキュメントではそれらすべてを要約し、Kotlin 1.7 から Kotlin 1.8 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性を紹介します：

- **ソース（source）**: ソース非互換の変更により、以前は正常にコンパイルできていた（エラーや警告なし）コードがコンパイルできなくなります。
- **バイナリ（binary）**: 2 つのバイナリアーティファクトを入れ替えても、ロードやリンクのエラーが発生しない場合、それらはバイナリ互換であると言います。
- **振る舞い（behavioral）**: 変更の適用前後で、同じプログラムが異なる動作を示す場合、その変更は振る舞い非互換であると言います。

これらの定義は純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語（例：Java）の観点からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語（Language）

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

### 抽象スーパークラスのメンバに対する super 呼び出しの委譲を禁止

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
> 
> **Short summary**: スーパークラスの「抽象（abstract）」メンバに対して明示的または暗黙的な super 呼び出しが委譲される場合、スーパーインターフェースにデフォルト実装があっても、Kotlin はコンパイルエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての抽象メンバをオーバーライドしていない非抽象クラスが使用されている場合に警告を導入
> - 1.7.0: super 呼び出しが実際にスーパークラスの抽象メンバにアクセスしている場合に警告を報告
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換モードが有効な場合、影響を受けるすべてのケースでエラーを報告。プログレッシブモードでエラーを報告
> - 1.8.0: スーパークラスのオーバーライドされていない抽象メソッドを持つ具象クラスの宣言、および `Any` メソッドの super 呼び出しがスーパークラスで抽象としてオーバーライドされている場合にエラーを報告
> - 1.9.0: スーパークラスの抽象メソッドに対する明示的な super 呼び出しを含む、影響を受けるすべてのケースでエラーを報告

### when-with-subject における紛らわしい文法を非推奨化

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.6 では、`when` 条件式におけるいくつかの紛らわしい文法構造を非推奨にしました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式に対して非推奨警告を導入
> - 1.8.0: この警告をエラーに引き上げ。`-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` を使用して一時的に 1.8 以前の動作に戻すことが可能
> - &gt;= 1.9: 非推奨となったいくつかの構造を新しい言語機能のために別の目的に転換

### 異なる数値型間の暗黙的な強制型変換を防止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Kotlin は、意味的にその型へのダウンキャストのみが必要な場合に、数値型をプリミティブ数値型へ自動的に変換することを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべてのケースで古い動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャストの動作を修正。`-Xuse-old-backend` を使用して一時的に 1.5.30 修正前の動作に戻すことが可能
> - &gt;= 1.9: 他の影響を受けるケースにおけるダウンキャストの動作を修正

### シールドクラスの private コンストラクタを真に private に変更

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: プロジェクト構造内のどこでシールドクラスの継承者を宣言できるかという制限が緩和された後、シールドクラスのコンストラクタのデフォルトの可視性は protected になりました。しかし、1.8 までは、Kotlin は依然としてそれらのクラスのスコープ外から、明示的に宣言されたシールドクラスの private コンストラクタを呼び出すことを許可していました。
>
> **Deprecation cycle**:
>
> - 1.6.20: シールドクラスの private コンストラクタがそのクラスの外で呼び出された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: private コンストラクタにデフォルトの可視性ルールを適用（private コンストラクタへの呼び出しは、その呼び出しが対応するクラス内にある場合にのみ解決可能）。`-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` コンパイラ引数を指定することで、一時的に古い動作に戻すことが可能

### ビルダー推論コンテキストにおいて互換性のない数値型に対する operator == の使用を禁止

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、ビルダー推論ラムダ関数のスコープにおいて、現在他のコンテキストで行っているのと同様に、互換性のない数値型（例：`Int` と `Long`）に対する演算子 `==` の使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 互換性のない数値型に対して演算子 `==` が使用された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` を使用して一時的に 1.8 以前の動作に戻すことが可能

### エルビス演算子の右辺における else なしの if および網羅的でない when の使用を禁止

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、エルビス演算子（`?:`）の右辺で網羅的でない `when` または `else` ブロックのない `if` 式を使用することを禁止します。以前は、エルビス演算子の結果が式として使用されない場合に許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのような網羅的でない if および when 式に対して警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` を使用して一時的に 1.8 以前の動作に戻すことが可能

### ジェネリック型エイリアスの使用における上限境界違反を禁止（1 つの型パラメータがエイリアスされた型の複数の型引数に使用されている場合）

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、型エイリアスの 1 つの型パラメータがエイリアスされた型の複数の型引数に使用されている場合（例：`typealias Alias<T> = Base<T, T>`）、エイリアスされた型の対応する型パラメータの上限境界制限に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: エイリアスされた型の対応する型パラメータの上限境界制約に違反する型引数を持つ型エイリアスの使用に対して警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` を使用して一時的に 1.8 以前の動作に戻すことが可能

### ジェネリック型エイリアスの使用における上限境界違反を禁止（型パラメータがエイリアスされた型の型引数のジェネリック型引数として使用されている場合）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、型エイリアスの型パラメータがエイリアスされた型の型引数のジェネリック型引数として使用されている場合（例：`typealias Alias<T> = Base<List<T>>`）、エイリアスされた型の対応する型パラメータの上限境界制限に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.8.0: ジェネリック型エイリアスの使用において、エイリアスされた型の対応する型パラメータの上限境界制約に違反する型引数がある場合に警告を報告
> - &gt;=1.10: 警告をエラーに引き上げ

### デリゲート内で拡張プロパティに宣言された型パラメータの使用を禁止

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、ジェネリック型の拡張プロパティを、レシーバーの型パラメータを安全でない方法で使用するジェネリック型に委譲することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 委譲されたプロパティの型引数から特定の方法で推論された型パラメータを使用する型に、拡張プロパティを委譲する場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` を使用して一時的に 1.8 以前の動作に戻すことが可能

### suspend 関数に対する @Synchronized アノテーションを禁止

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、同期（synchronized）ブロック内で中断（suspending）呼び出しが発生することを許可すべきではないため、suspend 関数に `@Synchronized` アノテーションを付加することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.0: `@Synchronized` アノテーションが付加された suspend 関数に対して警告を報告。プログレッシブモードでは警告はエラーとして報告される
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-SynchronizedSuspendError` を使用して一時的に 1.8 以前の動作に戻すことが可能

### 可変引数（vararg）でないパラメータへの引数渡しにスプレッド演算子を使用することを禁止

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は特定の条件下で、可変引数でない配列パラメータに対してスプレッド演算子（`*`）を用いた配列の受け渡しを許可していました。Kotlin 1.8 以降、これは禁止されます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 可変引数でない配列パラメータが期待される場所でスプレッド演算子が使用された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` を使用して一時的に 1.8 以前の動作に戻すことが可能

### ラムダの戻り値の型によってオーバーロードされた関数に渡されるラムダ内での null 安全性違反を禁止

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.8 では、オーバーロードが null 許容な戻り値の型を許可していない場合に、それらのラムダの戻り値の型によってオーバーロードされた関数に渡されるラムダから `null` を返すことを禁止します。以前は、`null` が `when` 演算子のブランチの 1 つから返される場合に許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 型不一致の警告を報告（またはプログレッシブモードではエラー）
> - 1.8.0: 警告をエラーに引き上げ。`-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` を使用して一時的に 1.8 以前の動作に戻すことが可能

### 公開シグネチャでローカル型を近似する際の null 許容性を維持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース、バイナリ
>
> **Short summary**: 戻り値の型が明示的に指定されていない式本体形式の関数からローカル型または匿名型が返される場合、Kotlin コンパイラはその型の既知のスーパークラスを使用して戻り値の型を推論（または近似）します。この際、実際には null 値が返される可能性があるにもかかわらず、コンパイラが null 非許容型を推論することがあります。
>
> **Deprecation cycle**:
>
> - 1.8.0: フレキシブルな型（flexible types）をフレキシブルなスーパータイプで近似
> - 1.8.0: 本来 null 許容であるべき宣言が null 非許容型として推論される場合に警告を報告し、型を明示的に指定するようユーザーに促す
> - 1.9.0: null 許容型を null 許容スーパータイプで近似。`-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` を使用して一時的に 1.9 以前の動作に戻すことが可能

### 非推奨化（deprecation）をオーバーライドを通じて伝播させない

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、スーパークラスの非推奨メンバからサブクラスのオーバーライドメンバへの非推奨化の伝播を停止します。これにより、スーパークラスのメンバを非推奨にしつつ、サブクラスでは非推奨でない状態のままにするための明示的なメカニズムが提供されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来の動作変更のメッセージと、この警告を抑制するか、非推奨メンバのオーバーライドに明示的に `@Deprecated` アノテーションを記述するよう促す警告を報告
> - 1.9.0: オーバーライドされたメンバへの非推奨ステータスの伝播を停止。この変更はプログレッシブモードでも即座に有効になる

### ビルダー推論コンテキストにおいて型変数を上限境界に暗黙的に推論することを禁止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、現在他のコンテキストで行っているのと同様に、ビルダー推論ラムダ関数のスコープにおいて、使用側の型情報がない場合に型変数を対応する型パラメータの上限境界に推論することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.20: 使用側の型情報がない場合に型パラメータが宣言された上限境界に推論される場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` を使用して一時的に 1.9 以前の動作に戻すことが可能

### アノテーションクラスのパラメータ宣言以外でのコレクションリテラルの使用を禁止

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin では、アノテーションクラスのパラメータへの配列の受け渡しや、これらのパラメータのデフォルト値の指定という制限された方法でのみコレクションリテラルの使用を許可しています。しかし、それ以外にも、Kotlin はアノテーションクラス内の他の場所（例：ネストされたオブジェクト内）でのコレクションリテラルの使用を許可していました。Kotlin 1.9 では、アノテーションクラスのパラメータのデフォルト値以外でのコレクションリテラルの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: アノテーションクラス内のネストされたオブジェクトにおける配列リテラルに対して警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ

### デフォルト値の式におけるデフォルト値を持つパラメータの前方参照を禁止

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、他のパラメータのデフォルト値の式において、デフォルト値を持つパラメータを前方参照（forward referencing）することを禁止します。これにより、デフォルト値の式でパラメータがアクセスされるまでに、そのパラメータには関数に渡された値か、自身のデフォルト値の式によって初期化された値が既に存在することが保証されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: デフォルト値を持つパラメータが、自身より前に記述されている別のパラメータのデフォルト値の中で参照されている場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` を使用して一時的に 1.9 以前の動作に戻すことが可能

### インライン関数パラメータに対する拡張呼び出しを禁止

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin はインライン関数パラメータを別のインライン関数にレシーバーとして渡すことを許可していましたが、そのようなコードをコンパイルすると常にコンパイラ例外が発生していました。Kotlin 1.9 ではこれを禁止し、コンパイラのクラッシュではなくエラーを報告するようにします。
>
> **Deprecation cycle**:
>
> - 1.7.20: インライン関数パラメータに対するインライン拡張呼び出しに対して警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ

### 匿名関数引数を持つ suspend という名前の中置関数の呼び出しを禁止

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、匿名関数リテラルとして渡される関数型の引数を 1 つ持つ、`suspend` という名前の中置関数の呼び出しを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.7.20: 匿名関数リテラルを用いた suspend 中置呼び出しに対して警告を報告
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ModifierNonBuiltinSuspendFunError` を使用して一時的に 1.9 以前の動作に戻すことが可能
> - &gt;=1.10: パーサーによる `suspend fun` トークンシーケンスの解釈方法を変更

### 内部クラスにおいてキャプチャされた型パラメータをそのバリアンスに反して使用することを禁止

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、`in` または `out` バリアンス（変位）を持つ外部クラスの型パラメータを、その内部クラスにおいて、宣言されたバリアンスに違反する位置で使用することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 外部クラスの型パラメータの使用位置がそのパラメータのバリアンスルールに違反している場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` を使用して一時的に 1.9 以前の動作に戻すことが可能

### 複合代入演算子内での明示的な戻り値の型を持たない関数の再帰呼び出しを禁止

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、現在その関数の本体内の他の式で行っているのと同様に、関数本体内の複合代入演算子の引数において、明示的に戻り値の型が指定されていない関数を呼び出すことを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 明示的に戻り値の型が指定されていない関数が、その関数の本体内の複合代入演算子の引数で再帰的に呼び出された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ

### @NotNull T が期待される場所に null 許容な境界を持つ Kotlin ジェネリックパラメータを渡す安全でない呼び出しを禁止

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、Java メソッドの `@NotNull` アノテーションが付いたパラメータに対して、潜在的に null 許容なジェネリック型の値を渡すメソッド呼び出しを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: null 非許容型が期待される場所に、制約のないジェネリック型パラメータが渡された場合に警告を報告
> - 1.9.0: 上記の警告の代わりに型不一致エラーを報告。`-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` を使用して一時的に 1.8 以前の動作に戻すことが可能

### 列挙型の初期化子からその列挙型のコンパニオンのメンバへのアクセスを禁止

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、列挙型（enum）のエントリ初期化子から、その列挙型のコンパニオンオブジェクトに対するあらゆる種類のアクセスを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのようなコンパニオンメンバへのアクセスに対して警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` を使用して一時的に 1.8 以前の動作に戻すことが可能

### Enum.declaringClass シンセティックプロパティを非推奨化および削除

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、基盤となる Java クラス `java.lang.Enum` のメソッド `getDeclaringClass()` から生成されたシンセティックプロパティ `declaringClass` を `Enum` 値で使用することを許可していましたが、このメソッドは Kotlin の `Enum` 型では利用できません。Kotlin 1.9 ではこのプロパティの使用を禁止し、代わりに拡張プロパティ `declaringJavaClass` への移行を提案します。
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` プロパティの使用に対して警告（またはプログレッシブモードではエラー）を報告し、`declaringJavaClass` 拡張への移行を提案
> - 1.9.0: 警告をエラーに引き上げ。`-XXLanguage:-ProhibitEnumDeclaringClass` を使用して一時的に 1.9 以前の動作に戻すことが可能
> - &gt;=1.10: `declaringClass` シンセティックプロパティを削除

### コンパイラオプション -Xjvm-default の enable および compatibility モードを非推奨化

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.6.20 は、`-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードの使用について警告します。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードに対して警告を導入
> - &gt;= 1.9: この警告をエラーに引き上げ

## 標準ライブラリ（Standard library）

### Range/Progression が Collection を実装することによる潜在的なオーバーロード解決の変更について警告

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: コア言語 / kotlin-stdlib
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、標準の progression およびそれらを継承する具体的な range に `Collection` インターフェースを実装する予定です。これにより、あるメソッドに要素を受け取るものとコレクションを受け取るものの 2 つのオーバーロードがある場合、オーバーロード解決で異なるオーバーロードが選択される可能性があります。Kotlin は、そのようなオーバーロードされたメソッドが range または progression の引数で呼び出されたときに警告またはエラーを報告することで、この状況を可視化します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来的に progression/range が `Collection` インターフェースを実装することで別のオーバーロードが選択されることになる場合、標準の progression またはその継承関係にある range を引数としてオーバーロードされたメソッドを呼び出す際に警告を報告
> - 1.8.0: この警告をエラーに引き上げ
> - 1.9.0: エラーの報告を停止し、progression に `Collection` インターフェースを実装することで、影響を受けるケースにおいてオーバーロード解決の結果を変更

### kotlin.dom および kotlin.browser パッケージの宣言を kotlinx.* へ移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース
>
> **Short summary**: 標準ライブラリからの抽出に備えて、`kotlin.dom` および `kotlin.browser` パッケージの宣言を対応する `kotlinx.*` パッケージに移動します。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替 API を導入
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージの API を非推奨にし、上記の新しい API を代替として提案
> - 1.6.0: 非推奨レベルをエラーに引き上げ
> - 1.8.20: JS-IR ターゲットにおいて非推奨の関数を stdlib から削除
> - &gt;= 1.9: kotlinx.* パッケージの API を別個のライブラリに移動

### 一部の JS 専用 API を非推奨化

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース
>
> **Short summary**: stdlib 内の多数の JS 専用関数が削除のために非推奨化されました。これには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（例：`Array<out T>.sort(comparison: (a: T, b: T) -> Int)`）が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨化
> - 1.9.0: 非推奨レベルをエラーに引き上げ
> - &gt;=1.10.0: 公開 API から非推奨の関数を削除

## ツール（Tools）

### KotlinCompile タスクの classpath プロパティの非推奨レベルを引き上げ

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: `KotlinCompile` タスクの `classpath` プロパティが非推奨になりました。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` プロパティを非推奨化
> - 1.8.0: 非推奨レベルをエラーに引き上げ
> - &gt;=1.9.0: 公開 API から非推奨の関数を削除

### kapt.use.worker.api Gradle プロパティを削除

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: Gradle Workers API を介して kapt を実行できるようにしていた `kapt.use.worker.api` プロパティを削除します（デフォルト：true）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に引き上げ
> - 1.8.0: このプロパティを削除

### kotlin.compiler.execution.strategy システムプロパティを削除

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: 振る舞い
>
> **Short summary**: コンパイラの実行戦略を選択するために使用されていた `kotlin.compiler.execution.strategy` システムプロパティを削除します。代わりに Gradle プロパティ `kotlin.compiler.execution.strategy` またはコンパイルタスクプロパティ `compilerExecutionStrategy` を使用してください。
>
> **Deprecation cycle:**
>
> - 1.7.0: 非推奨レベルを警告に引き上げ
> - 1.8.0: プロパティを削除

### コンパイラオプションの変更

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース、バイナリ
>
> **Short summary**: この変更は Gradle プラグインの作成者に影響を与える可能性があります。`kotlin-gradle-plugin` において、一部の内部型に追加のジェネリックパラメータがあります（ジェネリック型または `*` を追加する必要があります）。`KotlinNativeLink` タスクは `AbstractKotlinNativeCompile` タスクを継承しなくなりました。`KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションは非推奨となりました。代わりに `Kotlin2JsCompile.outputFileProperty` タスク入力を使用してください。`kotlinOptions` タスク入力および `kotlinOptions{...}` タスク DSL はサポートモードにあり、今後のリリースで非推奨となる予定です。`compilerOptions` および `kotlinOptions` はタスク実行フェーズで変更できません（[Kotlin 1.8 の新機能](whatsnew18.md#limitations)の 1 つの例外を参照）。`freeCompilerArgs` は不変の `List<String>` を返します。`kotlinOptions.freeCompilerArgs.remove("something")` は失敗します。古い JVM バックエンドの使用を許可していた `useOldBackend` プロパティが削除されました。
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` タスクが `AbstractKotlinNativeCompile` を継承しなくなりました。`KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションが非推奨となりました。古い JVM バックエンドの使用を許可していた `useOldBackend` プロパティが削除されました。

### kotlin.internal.single.build.metrics.file プロパティを非推奨化

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: ビルドレポート用の単一ファイルを定義するために使用されていた `kotlin.internal.single.build.metrics.file` プロパティを非推奨にします。代わりに `kotlin.build.report.single_file` プロパティを `kotlin.build.report.output=single_file` と共に使用してください。
>
> **Deprecation cycle:**
>
> - 1.8.0: 非推奨レベルを警告に引き上げ
> &gt;= 1.9: プロパティを削除
[//]: # (title: Kotlin 1.8 互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ことと、_[快適なアップデート](kotlin-evolution-principles.md)_は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構文は削除されるべきであると述べており、後者は、コード移行を可能な限りスムーズにするために、この削除が事前に十分に周知されるべきであると述べています。

言語の変更のほとんどは、更新の変更ログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 1.7からKotlin 1.8への移行に関する完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

-   _ソース_: ソース非互換な変更とは、以前は（エラーや警告なしに）正常にコンパイルされていたコードが、もはやコンパイルできなくなる変更を指します。
-   _バイナリ_: 2つのバイナリ成果物がバイナリ互換であるとは、それらを交換しても読み込みエラーやリンクエラーが発生しないことを指します。
-   _動作_: 変更が動作非互換であるとは、同じプログラムが変更適用前後で異なる動作を示すことを指します。

これらの定義は、純粋なKotlinにのみ適用されることを覚えておいてください。他の言語の視点（例えば、Javaから）でのKotlinコードの互換性は、このドキュメントの範囲外です。

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

### 抽象スーパークラスメンバーへの `super` 呼び出しの委譲を禁止

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、明示的または暗黙的な `super` 呼び出しがスーパークラスの_抽象_メンバーに委譲されている場合、たとえスーパーインターフェースにデフォルト実装があったとしても、コンパイルエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用されている場合に警告を報告
> - 1.7.0: `super` 呼び出しが実際にスーパークラスの抽象メンバーにアクセスしている場合に警告を報告
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換性モードが有効な場合、影響を受けるすべてのケースでエラーを報告。プログレッシブモードではエラーを報告
> - 1.8.0: スーパークラスの抽象メソッドがオーバーライドされていない具象クラスを宣言するケース、および `Any` メソッドの `super` 呼び出しがスーパークラスで抽象としてオーバーライドされているケースでエラーを報告
> - 1.9.0: 明示的な抽象メソッドへの `super` 呼び出しを含む、影響を受けるすべてのケースでエラーを報告

### `when-with-subject` における紛らわしい文法を非推奨化

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、`when` 条件式におけるいくつかの紛らわしい文法構造を非推奨化しました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式で非推奨警告を導入
> - 1.8.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` を使用して一時的に1.8以前の挙動に戻すことが可能
> - `>= 1.9`: 非推奨化された一部の構文を新しい言語機能のために再利用

### 異なる数値型間での暗黙的な型変換を防止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlinは、意味的にその型へのダウンキャストのみが必要な場合に、数値が自動的にプリミティブな数値型に変換されることを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべてのケースで古い挙動
> - 1.5.30: 生成されたプロパティデリゲートアクセサーでのダウンキャストの挙動を修正。`-Xuse-old-backend` を使用して一時的に1.5.30以前の修正前の挙動に戻すことが可能
> - `>= 1.9`: 他の影響を受けるケースでのダウンキャストの挙動を修正

### シールドクラスの private コンストラクタを本当に private にする

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: プロジェクト構造内でシールドクラスの継承を宣言できる場所に関する制限を緩和した後、シールドクラスのコンストラクタのデフォルト可視性は `protected` になりました。しかし、1.8までは、Kotlinはシールドクラスの明示的に宣言された `private` コンストラクタをそれらのクラスのスコープ外から呼び出すことを依然として許可していました。
>
> **Deprecation cycle**:
>
> - 1.6.20: シールドクラスの `private` コンストラクタがそのクラスの外から呼び出された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: `private` コンストラクタにデフォルトの可視性ルールを使用（`private` コンストラクタへの呼び出しは、その呼び出しが対応するクラス内にある場合にのみ解決可能）。`-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` コンパイラ引数を指定することで、一時的に古い挙動に戻すことが可能

### ビルダー推論コンテキストにおいて、互換性のない数値型に対する演算子 `==` の使用を禁止

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、ビルダー推論ラムダ関数のスコープ内で、`Int` と `Long` のように互換性のない数値型に対して演算子 `==` を使用することを禁止します。これは、他のコンテキストで現在行われているのと同じ方法です。
>
> **Deprecation cycle**:
>
> - 1.6.20: 互換性のない数値型に対して演算子 `==` が使用された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに格上げ。`-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` を使用して一時的に1.8以前の挙動に戻すことが可能

### `if` に `else` がない場合、および `Elvis` 演算子の右辺に非網羅的な `when` を禁止

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、`Elvis` 演算子 (`?:`) の右辺に非網羅的な `when` または `else` ブランチのない `if` 式を使用することを禁止します。以前は、`Elvis` 演算子の結果が式として使用されない場合に許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのような非網羅的な `if` および `when` 式に対して警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` を使用して一時的に1.8以前の挙動に戻すことが可能

### ジェネリック型エイリアスの使用における上限制約違反を禁止（エイリアスされた型の複数の型引数で1つの型パラメータが使用される場合）

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、1つの型エイリアス型パラメータがエイリアスされた型の複数の型引数で使用される場合（例: `typealias Alias<T> = Base<T, T>`）、エイリアスされた型の対応する型パラメータの上限制約に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 型エイリアスの使用において、型引数がエイリアスされた型の対応する型パラメータの上限制約に違反する場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: この警告をエラーに格上げ。`-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` を使用して一時的に1.8以前の挙動に戻すことが可能

### ジェネリック型エイリアスの使用における上限制約違反を禁止（エイリアスされた型の型引数のジェネリック型引数で型パラメータが使用される場合）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、型エイリアスの型パラメータがエイリアスされた型の型引数のジェネリック型引数として使用される場合（例: `typealias Alias<T> = Base<List<T>>`）、エイリアスされた型の対応する型パラメータの上限制約に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.8.0: ジェネリック型エイリアスの使用において、型引数がエイリアスされた型の対応する型パラメータの上限制約に違反する場合に警告を報告
> - `>=1.10`: 警告をエラーに格上げ

### デリゲート内で拡張プロパティのために宣言された型パラメータの使用を禁止

> **Issue**: [KT-24643](https://youtrack.com/issue/KT-24643)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、ジェネリック型上の拡張プロパティを、レシーバの型パラメータを安全でない方法で使用するジェネリック型に委譲することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 拡張プロパティが、委譲されたプロパティの型引数から推論された型パラメータを特定の方法で使用する型に委譲される場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに格上げ。`-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` を使用して一時的に1.8以前の挙動に戻すことが可能

### 停止関数への `@Synchronized` アノテーションの禁止

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、`@Synchronized` アノテーションを停止関数に付与することを禁止します。これは、停止呼び出しが同期ブロック内で発生することを許可すべきではないためです。
>
> **Deprecation cycle**:
>
> - 1.6.0: `@Synchronized` アノテーションが付与された停止関数に警告を報告。プログレッシブモードではエラーとして報告
> - 1.8.0: 警告をエラーに格上げ。`-XXLanguage:-SynchronizedSuspendError` を使用して一時的に1.8以前の挙動に戻すことが可能

### 可変長引数ではないパラメータへの引数渡しにスプレッド演算子を使用することを禁止

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、特定の条件で、可変長引数ではない配列パラメータにスプレッド演算子 (`*`) を使用して配列を渡すことを許可していました。Kotlin 1.8からは、これは禁止されます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 可変長引数ではない配列パラメータが期待される場所でスプレッド演算子が使用された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに格上げ。`-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` を使用して一時的に1.8以前の挙動に戻すことが可能

### ラムダの戻り値の型でオーバーロードされた関数に渡されるラムダでの Null 安全違反を禁止

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8では、ラムダの戻り値の型でオーバーロードされた関数に渡されるラムダから `null` を返すことを禁止します。これは、オーバーロードがNull許容の戻り型を許可しない場合に適用されます。以前は、`when` 演算子の一部のブランチから `null` が返された場合に許可されていました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 型不一致の警告（またはプログレッシブモードではエラー）を報告
> - 1.8.0: 警告をエラーに格上げ。`-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` を使用して一時的に1.8以前の挙動に戻すことが可能

### パブリックシグネチャでローカル型を近似する際に Null 許容性を保持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 明示的に指定された戻り型を持たない式本体関数からローカルまたは匿名型が返される場合、Kotlinコンパイラはその型の既知のスーパタイプを使用して戻り型を推論（または近似）します。この際、コンパイラは実際に `null` 値が返される可能性がある場合に、非Null許容型を推論する可能性があります。
>
> **Deprecation cycle**:
>
> - 1.8.0: 柔軟な型を柔軟なスーパタイプで近似
> - 1.8.0: Null許容であるべき宣言が非Null許容型として推論された場合に警告を報告し、ユーザーに型を明示的に指定するよう促す
> - 1.9.0: Null許容型をNull許容スーパタイプで近似。`-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` を使用して一時的に1.9以前の挙動に戻すことが可能

### オーバーライドによる非推奨の伝播を停止

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、スーパークラスの非推奨メンバーからサブクラスのそれをオーバーライドするメンバーへの非推奨の伝播を停止します。これにより、スーパークラスのメンバーを非推奨にしながら、サブクラスでは非推奨にしないという明示的なメカニズムが提供されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来の挙動変更のメッセージと、この警告を抑制するか、非推奨メンバーのオーバーライドに `@Deprecated` アノテーションを明示的に記述するかのプロンプトを含む警告を報告
> - 1.9.0: オーバーライドされたメンバーへの非推奨ステータスの伝播を停止。この変更はプログレッシブモードでもすぐに有効になる

### ビルダー推論コンテキストにおいて、ユースサイトの型情報がない場合に型変数を暗黙的に上限に推論することを禁止

> **Issue**: [KT-47986](https://youtDag.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、ビルダー推論ラムダ関数のスコープにおいて、ユースサイトの型情報がない場合に、型変数を対応する型パラメータの上限に推論することを禁止します。これは、現在他のコンテキストで行われているのと同じ方法です。
>
> **Deprecation cycle**:
>
> - 1.7.20: ユースサイトの型情報がない場合に、型パラメータが宣言された上限に推論された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` を使用して一時的に1.9以前の挙動に戻すことが可能

### アノテーションクラスのパラメータ宣言以外の場所でのコレクションリテラルの使用を禁止

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinでは、アノテーションクラスのパラメータに配列を渡すため、またはこれらのパラメータのデフォルト値を指定するために、コレクションリテラルを限定的に使用することを許可しています。しかし、それ以外に、アノテーションクラス内の他の場所（例: そのネストされたオブジェクト内）でのコレクションリテラルの使用も許可されていました。Kotlin 1.9では、アノテーションクラスのパラメータのデフォルト値以外でのコレクションリテラルの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: アノテーションクラス内のネストされたオブジェクトにある配列リテラルに警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ

### デフォルト値式でデフォルト値を持つパラメータを前方参照することを禁止

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、デフォルト値式で、デフォルト値を持つパラメータを他のパラメータのデフォルト値式で前方参照することを禁止します。これにより、パラメータがデフォルト値式でアクセスされる時点で、関数に渡されるか、自身のデフォルト値式によって初期化されるかのいずれかで値を持つことが保証されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: デフォルト値を持つパラメータが、それより前に来る別のパラメータのデフォルト値で参照された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` を使用して一時的に1.9以前の挙動に戻すことが可能

### インライン関数パラメータへの拡張呼び出しを禁止

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinでは、インライン関数パラメータを別のインライン関数にレシーバとして渡すことを許可していましたが、そのようなコードをコンパイルすると常にコンパイラ例外が発生していました。Kotlin 1.9ではこれを禁止し、コンパイラのクラッシュではなくエラーを報告するようになります。
>
> **Deprecation cycle**:
>
> - 1.7.20: インライン関数パラメータへのインライン拡張呼び出しに対して警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ

### 匿名関数引数を持つ `suspend` という名前の中置関数への呼び出しを禁止

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、単一の関数型引数を匿名関数リテラルとして持つ `suspend` という名前の中置関数を呼び出すことを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.7.20: 匿名関数リテラルを持つ `suspend` 中置呼び出しに対して警告を報告
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ModifierNonBuiltinSuspendFunError` を使用して一時的に1.9以前の挙動に戻すことが可能
> - `>=1.10`: `suspend fun` トークンシーケンスがパーサーによって解釈される方法を変更

### 内部クラスにおける外側クラスのキャプチャされた型パラメータの使用が、それらの分散に反することを禁止

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、`in` または `out` 分散を持つ外側クラスの型パラメータを、そのクラスの内部クラスで、その型パラメータの宣言された分散に違反する位置で使用することを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 外側クラスの型パラメータの使用位置がそのパラメータの分散ルールに違反する場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` を使用して一時的に1.9以前の挙動に戻すことが可能

### 複合代入演算子において、明示的な戻り型を持たない関数の再帰呼び出しを禁止

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、明示的に指定された戻り型を持たない関数を、その関数の本体内の複合代入演算子の引数で再帰的に呼び出すことを禁止します。これは、現在その関数の本体内の他の式で禁止されているのと同じ方法です。
>
> **Deprecation cycle**:
>
> - 1.7.0: 明示的に指定された戻り型を持たない関数が、その関数の本体内の複合代入演算子の引数で再帰的に呼び出された場合に警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ

### `@NotNull T` が期待され、Nullable な上限を持つ Kotlin ジェネリックパラメータが与えられた場合の不健全な呼び出しを禁止

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、潜在的に Null 許容のジェネリック型の値が、Java メソッドの `@NotNull` アノテーション付きパラメータに渡されるメソッド呼び出しを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 制約のないジェネリック型パラメータが非 Null 許容型が期待される場所に渡された場合に警告を報告
> - 1.9.0: 上記の警告の代わりに型不一致エラーを報告。`-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` を使用して一時的に1.8以前の挙動に戻すことが可能

### enum クラスのコンパニオンのメンバーへのアクセスを、この enum のエントリ初期化子から禁止

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、enum エントリ初期化子から enum のコンパニオンオブジェクトへのあらゆる種類のアクセスを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのようなコンパニオンメンバーアクセスに対して警告（またはプログレッシブモードではエラー）を報告
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` を使用して一時的に1.8以前の挙動に戻すことが可能

### `Enum.declaringClass` 合成プロパティを非推奨化し削除

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、基盤となるJavaクラス `java.lang.Enum` の `getDeclaringClass()` メソッドから生成される `Enum` 値に対して、合成プロパティ `declaringClass` の使用を許可していましたが、このメソッドはKotlinの `Enum` 型では利用できません。Kotlin 1.9ではこのプロパティの使用を禁止し、代わりに拡張プロパティ `declaringJavaClass` への移行を提案します。
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` プロパティの使用に対して警告（またはプログレッシブモードではエラー）を報告し、`declaringJavaClass` 拡張への移行を提案
> - 1.9.0: 警告をエラーに格上げ。`-XXLanguage:-ProhibitEnumDeclaringClass` を使用して一時的に1.9以前の挙動に戻すことが可能
> - `>=1.10`: `declaringClass` 合成プロパティを削除

### コンパイラオプション `-Xjvm-default` の `enable` および `compatibility` モードを非推奨化

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20では、コンパイラオプション `-Xjvm-default` の `enable` および `compatibility` モードの使用について警告します。
>
> **Deprecation cycle**:
>
> - 1.6.20: コンパイラオプション `-Xjvm-default` の `enable` および `compatibility` モードに警告を導入
> - `>= 1.9`: この警告をエラーに格上げ

## 標準ライブラリ

### `Range`/`Progression` が `Collection` を実装する際の潜在的なオーバーロード解決の変更について警告

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9では、標準的なプログレッションとその継承された具体的な範囲で `Collection` インターフェースを実装することが計画されています。これにより、あるメソッドのオーバーロードが2つあり、1つが要素を受け入れ、もう1つがコレクションを受け入れる場合、オーバーロード解決で異なるオーバーロードが選択される可能性があります。Kotlinは、そのようなオーバーロードされたメソッドが範囲またはプログレッション引数で呼び出された場合に警告またはエラーを報告することで、この状況を可視化します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 標準プログレッションまたはその範囲継承者を引数としてオーバーロードされたメソッドが呼び出された場合に警告を報告。これは、将来このプログレッション/範囲が `Collection` インターフェースを実装することで、この呼び出しで別のオーバーロードが選択される場合に適用される
> - 1.8.0: この警告をエラーに格上げ
> - 1.9.0: エラーの報告を停止し、プログレッションに `Collection` インターフェースを実装することで、影響を受けるケースでのオーバーロード解決結果を変更

### `kotlin.dom` および `kotlin.browser` パッケージからの宣言を `kotlinx.*` に移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` および `kotlin.browser` パッケージからの宣言は、stdlibから抽出するための準備として、対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替APIを導入
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージのAPIを非推奨化し、上記の新しいAPIを代替として提案
> - 1.6.0: 非推奨レベルをエラーに格上げ
> - 1.8.20: JS-IR ターゲット向けに非推奨関数を stdlib から削除
> - `>= 1.9`: `kotlinx.*` パッケージのAPIを別のライブラリに移動

### 一部の JS 専用API を非推奨化

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib 内のいくつかのJS専用関数が削除のために非推奨化されます。これらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`) が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨化
> - 1.9.0: 非推奨レベルをエラーに格上げ
> - `>=1.10.0`: 非推奨関数を公開APIから削除

## ツール

### `KotlinCompile` タスクの `classpath` プロパティの非推奨レベルを格上げ

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` タスクの `classpath` プロパティが非推奨化されました。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` プロパティが非推奨化される
> - 1.8.0: 非推奨レベルをエラーに格上げ
> - `>=1.9.0`: 非推奨関数を公開APIから削除

### `kapt.use.worker.api` Gradle プロパティを削除

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kapt` を Gradle Workers API 経由で実行することを許可していた (`default: true`) `kapt.use.worker.api` プロパティを削除します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に格上げ
> - 1.8.0: このプロパティを削除

### `kotlin.compiler.execution.strategy` システムプロパティを削除

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: コンパイラ実行戦略を選択するために使用されていた `kotlin.compiler.execution.strategy` システムプロパティを削除します。代わりにGradleプロパティ `kotlin.compiler.execution.strategy` またはコンパイルタスクプロパティ `compilerExecutionStrategy` を使用してください。
>
> **Deprecation cycle:**
>
> - 1.7.0: 非推奨レベルを警告に格上げ
> - 1.8.0: プロパティを削除

### コンパイラオプションの変更

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: source, binary
>
> **Short summary**: この変更はGradleプラグイン作者に影響を与える可能性があります。`kotlin-gradle-plugin` では、一部の内部型にジェネリックパラメータが追加されています（ジェネリック型または `*` を追加する必要があります）。`KotlinNativeLink` タスクはもはや `AbstractKotlinNativeCompile` タスクを継承しません。`KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションは非推奨化されました。代わりに `Kotlin2JsCompile.outputFileProperty` タスク入力を使用してください。`kotlinOptions` タスク入力と `kotlinOptions{...}` タスクDSLはサポートモードであり、今後のリリースで非推奨化されます。`compilerOptions` と `kotlinOptions` はタスク実行フェーズで変更できません（[Kotlin 1.8の新機能](whatsnew18.md#limitations) の例外を参照）。`freeCompilerArgs` はイミュータブルな `List<String>` を返します。`kotlinOptions.freeCompilerArgs.remove("something")` は失敗します。古いJVMバックエンドを使用することを許可していた `useOldBackend` プロパティは削除されました。
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` タスクは `AbstractKotlinNativeCompile` を継承しません。`KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションは非推奨化されました。古いJVMバックエンドを使用することを許可していた `useOldBackend` プロパティは削除されました。

### `kotlin.internal.single.build.metrics.file` プロパティを非推奨化

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: ビルドレポート用の単一ファイルを定義するために使用されていた `kotlin.internal.single.build.metrics.file` プロパティを非推奨化します。代わりに `kotlin.build.report.output=single_file` と合わせて `kotlin.build.report.single_file` プロパティを使用してください。
>
> **Deprecation cycle:**
>
> - 1.8.0: 非推奨レベルを警告に格上げ
> - `>= 1.9`: プロパティを削除
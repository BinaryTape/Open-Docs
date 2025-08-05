[//]: # (title: Kotlin 1.9 互換性ガイド)

_[言語のモダンさを保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本原則の一つです。前者は、言語の進化を妨げる構文は削除すべきであると述べ、後者は、コードの移行を可能な限り円滑にするために、この削除は事前に十分に伝達されるべきであると述べています。

言語の変更のほとんどは、更新チェンジログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 1.8からKotlin 1.9への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース_: ソース非互換な変更（source-incompatible change）とは、以前は問題なくコンパイルできていたコード（エラーや警告なし）が、もはやコンパイルできなくなる変更を指します。
- _バイナリ_: 2つのバイナリアーティファクトは、それらを入れ替えてもロードエラーやリンクエラーが発生しない場合、バイナリ互換（binary-compatible）であると言われます。
- _動作_: 変更が動作非互換（behavioral-incompatible）であると言われるのは、同じプログラムが変更適用前後で異なる動作を示す場合です。

これらの定義は純粋なKotlinに対してのみ与えられていることに注意してください。他の言語の観点（例えばJavaから見た）Kotlinコードの互換性については、このドキュメントの範囲外です。

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

### 言語バージョン 1.3 の削除

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では言語バージョン1.9を導入し、言語バージョン1.3のサポートを削除します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 警告を報告
> - 1.9.0: 警告をエラーに昇格

### スーパインターフェース型が関数リテラルの場合のスーパークラスのコンストラクタ呼び出しの禁止

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: インターフェースが関数リテラル型から継承している場合、Kotlin 1.9 ではスーパークラスのコンストラクタ呼び出しを禁止します。そのようなコンストラクタは存在しないためです。
>
> **Deprecation cycle**:
> * 1.7.0: 警告を報告（またはプログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格

### アノテーションのパラメータ型における循環の禁止

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、アノテーションの型が、直接的または間接的に、そのパラメータ型の1つとして使用されることを禁止します。これにより循環が作成されるのを防ぎます。
> ただし、アノテーション型の `Array` または `vararg` であるパラメータ型を持つことは許可されます。
>
> **Deprecation cycle**:
> * 1.7.0: アノテーションパラメータの型における循環について警告を報告（またはプログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格。一時的に1.9より前の動作に戻すには `-XXLanguage:-ProhibitCyclesInAnnotations` を使用できます。

### パラメータのない関数型に対する `@ExtensionFunctionType` アノテーションの使用禁止

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、パラメータのない関数型、または関数型ではない型に対して `@ExtensionFunctionType` アノテーションを使用することを禁止します。
>
> **Deprecation cycle**:
> * 1.7.0: 関数型ではない型に対するアノテーションについては警告を報告し、関数型である型に対するアノテーションについてはエラーを報告
> * 1.9.0: 関数型に対する警告をエラーに昇格

### Javaフィールドへの代入における型不一致の禁止

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、Javaフィールドに代入された値の型がそのJavaフィールドの投影型に一致しないことを検出した場合、コンパイラエラーを報告します。
>
> **Deprecation cycle**:
> * 1.6.0: 投影されたJavaフィールドの型が代入された値の型に一致しない場合に警告を報告（またはプログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格。一時的に1.9より前の動作に戻すには `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` を使用できます。

### プラットフォーム型におけるNull可能性アサーション例外でのソースコード抜粋の非表示

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 動作
>
> **Short summary**: Kotlin 1.9 では、式のnullチェックによって生成される例外メッセージにソースコードの抜粋が含まれなくなります。代わりに、メソッドまたはフィールドの名前が表示されます。
> 式がメソッドまたはフィールドでない場合、メッセージに追加情報は提供されません。
>
> **Deprecation cycle**:
> * < 1.9.0: 式のnullチェックによって生成される例外メッセージにソースコードの抜粋が含まれる
> * 1.9.0: 式のnullチェックによって生成される例外メッセージにメソッドまたはフィールド名のみが含まれる。一時的に1.9より前の動作に戻すには `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` を使用できます。

### 抽象スーパークラスメンバーへのスーパークラス呼び出しの委譲の禁止

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、明示的または暗黙的なスーパークラス呼び出しがスーパークラスの_抽象_メンバーに委譲される場合に、スーパインターフェースにデフォルトの実装がある場合でも、コンパイルエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用された場合に警告を導入
> - 1.7.0: スーパークラス呼び出しが実際にスーパークラスの抽象メンバーにアクセスする場合に警告を報告
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換性モードが有効になっている場合、影響を受けるすべてのケースでエラーを報告。
>   プログレッシブモードでエラーを報告
> - 1.8.0: スーパークラスのオーバーライドされていない抽象メソッドを持つ具象クラスを宣言するケース、および`Any` メソッドのスーパークラス呼び出しがスーパークラスで抽象としてオーバーライドされているケースでエラーを報告
> - 1.9.0: スーパークラスの抽象メソッドへの明示的なスーパークラス呼び出しを含む、影響を受けるすべてのケースでエラーを報告

### `when` 式の対象あり構文における紛らわしい文法の非推奨化

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
> - 1.8.0: この警告をエラーに昇格。
>   一時的に1.8より前の動作に戻すには `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` を使用できます。
> - &gt;= 2.1: いくつかの非推奨の構造を新しい言語機能のために再利用

### 異なる数値型間の暗黙的な型強制の防止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 動作
>
> **Short summary**: Kotlin は、意味的にその型へのダウンキャストのみが必要とされる場合、数値がプリミティブ数値型に自動変換されることを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべてのケースで以前の動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャスト動作を修正。
>   一時的に1.5.30より前の修正動作に戻すには `-Xuse-old-backend` を使用できます。
> - &gt;= 2.0: その他の影響を受けるケースにおけるダウンキャスト動作を修正

### ジェネリック型エイリアスの使用における上限違反の禁止（エイリアスされた型の型引数のジェネリック型引数で使用される型パラメータ）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、型エイリアスの型パラメータが、エイリアスされた型の型引数のジェネリック型引数として使用される場合（例: `typealias Alias<T> = Base<List<T>>`）、エイリアスされた型の対応する型パラメータの上限制約に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.8.0: ジェネリック型エイリアスの使用に、エイリアスされた型の対応する型パラメータの上限制約に違反する型引数がある場合に警告を報告
> - 2.0.0: 警告をエラーに昇格

### 公開シグネチャでローカル型を近似する際にnull可能性を保持する

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース、バイナリ
>
> **Short summary**: 明示的に指定された戻り値の型なしで式本体関数からローカルまたは匿名型が返される場合、Kotlinコンパイラは、その型の既知のスーパタイプを使用して戻り値の型を推論（または近似）します。
> この際、実際にはnull値が返される可能性があるにもかかわらず、コンパイラが非null型を推論する場合があります。
>
> **Deprecation cycle**:
>
> - 1.8.0: 柔軟な型を柔軟なスーパタイプで近似
> - 1.8.0: null許容であるべき宣言が非null型として推論される場合に警告を報告し、ユーザーに型を明示的に指定するよう促す
> - 2.0.0: null許容型をnull許容スーパタイプで近似。
>   一時的に2.0より前の動作に戻すには `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` を使用できます。

### オーバーライドによる非推奨の伝播の停止

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、スーパークラスの非推奨メンバーからサブクラスのオーバーライドメンバーへの非推奨の伝播を停止します。これにより、スーパークラスのメンバーを非推奨にする一方で、サブクラスでは非推奨にしないという明示的なメカニズムが提供されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来の動作変更のメッセージと、この警告を抑制するか、非推奨メンバーのオーバーライドに明示的に `@Deprecated` アノテーションを記述するよう促す警告を報告
> - 1.9.0: オーバーライドされたメンバーへの非推奨ステータスの伝播を停止します。この変更はプログレッシブモードでもすぐに有効になります。

### アノテーションクラスのパラメータ宣言以外の場所でのコレクションリテラルの使用禁止

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、コレクションリテラルを、アノテーションクラスのパラメータに配列を渡すため、またはこれらのパラメータのデフォルト値を指定するために、制限された方法で使用することを許可しています。
> しかし、それ以外にも、Kotlin はアノテーションクラス内の他の場所、例えばネストされたオブジェクト内でコレクションリテラルを使用することを許可していました。Kotlin 1.9 は、アノテーションクラスのパラメータのデフォルト値を除くどこかでのコレクションリテラルの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: アノテーションクラスのネストされたオブジェクト内の配列リテラルについて警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格

### デフォルト値式におけるパラメータの前方参照の禁止

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、他のパラメータのデフォルト値式におけるパラメータの前方参照を禁止します。これにより、パラメータがデフォルト値式でアクセスされる時点までに、関数に渡された値、またはそれ自身のデフォルト値式によって初期化された値がすでに存在することが保証されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: デフォルト値を持つパラメータが、それより前の別のパラメータのデフォルト値で参照される場合に警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格。
>   一時的に1.9より前の動作に戻すには `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` を使用できます。

### インライン関数パラメータに対する拡張呼び出しの禁止

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin はインライン関数パラメータを別のインライン関数にレシーバとして渡すことを許可していましたが、そのようなコードをコンパイルする際に常にコンパイラ例外を引き起こしました。
> Kotlin 1.9 はこれを禁止し、コンパイラをクラッシュさせる代わりにエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.7.20: インライン関数パラメータに対するインライン拡張呼び出しについて警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格

### 匿名関数引数を持つ `suspend` という名前の中置関数の呼び出しの禁止

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、匿名関数リテラルとして渡された関数型の単一の引数を持つ `suspend` という名前の中置関数の呼び出しを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.7.20: 匿名関数リテラルを伴う `suspend` 中置呼び出しについて警告を報告
> - 1.9.0: 警告をエラーに昇格。
>   一時的に1.9より前の動作に戻すには `-XXLanguage:-ModifierNonBuiltinSuspendFunError` を使用できます。
> - TODO: `suspend fun` トークンシーケンスがパーサーによって解釈される方法を変更

### 内部クラスにおけるキャプチャされた型パラメータの分散に反する使用の禁止

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、外側クラスの `in` または `out` 分散を持つ型パラメータが、その型パラメータの宣言された分散に違反する位置で、そのクラスの内部クラスで使用されることを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 外側クラスの型パラメータの使用位置がそのパラメータの分散ルールに違反する場合に警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格。
>   一時的に1.9より前の動作に戻すには `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` を使用できます。

### 複合代入演算子での明示的な戻り値の型がない関数の再帰呼び出しの禁止

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、その関数の本体内の複合代入演算子の引数で、明示的に指定された戻り値の型がない関数を呼び出すことを禁止します。これは現在、その関数の本体内の他の式で行っているのと同様です。
>
> **Deprecation cycle**:
>
> - 1.7.0: 明示的に指定された戻り値の型がない関数が、その関数の本体内の複合代入演算子引数で再帰的に呼び出される場合に警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格

### `@NotNull T` が期待され、null許容境界を持つKotlinジェネリックパラメータが与えられた場合の不健全な呼び出しの禁止

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、null許容の可能性があるジェネリック型の値が、Javaメソッドの `@NotNull` アノテーションが付けられたパラメータに渡されるメソッド呼び出しを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 非null型が期待される場合に、制約のないジェネリック型パラメータが渡されると警告を報告
> - 1.9.0: 上記の警告の代わりに型不一致エラーを報告。
>   一時的に1.8より前の動作に戻すには `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` を使用できます。

### enum エントリ初期化子からの enum クラスのコンパニオンメンバーへのアクセス禁止

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、enumエントリ初期化子からenumのコンパニオンオブジェクトへのあらゆる種類のアクセスを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのようなコンパニオンメンバーアクセスについて警告を報告（またはプログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格。
>   一時的に1.8より前の動作に戻すには `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` を使用できます。

### `Enum.declaringClass` 合成プロパティの非推奨化と削除

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin は、基底のJavaクラス `java.lang.Enum` のメソッド `getDeclaringClass()` から生成される `Enum` 値に対して、合成プロパティ `declaringClass` の使用を許可していました。このメソッドはKotlinの `Enum` 型では利用できないにもかかわらずです。Kotlin 1.9 はこのプロパティの使用を禁止し、代わりに拡張プロパティ `declaringJavaClass` への移行を提案します。
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` プロパティの使用について警告を報告（またはプログレッシブモードではエラー）。
>   `declaringJavaClass` 拡張への移行を提案。
> - 1.9.0: 警告をエラーに昇格。
>   一時的に1.9より前の動作に戻すには `-XXLanguage:-ProhibitEnumDeclaringClass` を使用できます。
> - 2.0.0: `declaringClass` 合成プロパティを削除

### コンパイラオプション `-Xjvm-default` の `enable` および `compatibility` モードの非推奨化

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 は、`-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードについて警告を導入
> - 1.9.0: この警告をエラーに昇格

### ビルダー推論コンテキストにおいて型変数を上限に暗黙的に推論することの禁止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 2.0 は、ビルダー推論ラムダ関数のスコープにおいて使用サイトの型情報がない場合に、型変数を対応する型パラメータの上限に推論することを禁止します。これは現在他のコンテキストで行っているのと同じ方法です。
>
> **Deprecation cycle**:
>
> - 1.7.20: 使用サイトの型情報がない場合に、型パラメータが宣言された上限に推論されると警告を報告（またはプログレッシブモードではエラー）
> - 2.0.0: 警告をエラーに昇格

## 標準ライブラリ

### Range/Progression が Collection を実装し始める際の潜在的なオーバーロード解決の変更に関する警告

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: コア言語 / kotlin-stdlib
>
> **Incompatible change type**: ソース
>
> **Short summary**: Kotlin 1.9 では、標準のプログレッションおよびそれらから継承された具象レンジに `Collection` インターフェースを実装することが計画されています。これにより、あるメソッドに2つのオーバーロードがあり、1つが要素を受け入れ、もう1つがコレクションを受け入れる場合、オーバーロード解決で別のオーバーロードが選択される可能性があります。
> Kotlin は、レンジまたはプログレッションの引数でそのようなオーバーロードされたメソッドが呼び出された場合に、警告またはエラーを報告することでこの状況を可視化します。
>
> **Deprecation cycle**:
>
> - 1.6.20: オーバーロードされたメソッドが、標準のプログレッションまたはそのレンジ継承者を引数として呼び出され、将来的にこのプログレッション/レンジによる `Collection` インターフェースの実装が、この呼び出しで別のオーバーロードが選択されることにつながる場合に警告を報告
> - 1.8.0: この警告をエラーに昇格
> - 2.1.0: エラーの報告を停止し、プログレッションで `Collection` インターフェースを実装することで、影響を受けるケースでのオーバーロード解決結果を変更

### `kotlin.dom` および `kotlin.browser` パッケージからの宣言を `kotlinx.*` に移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース
>
> **Short summary**: `kotlin.dom` および `kotlin.browser` パッケージの宣言は、標準ライブラリからそれらを抽出するための準備として、対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替APIを導入
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案
> - 1.6.0: 非推奨レベルをエラーに昇格
> - 1.8.20: JS-IRターゲットの標準ライブラリから非推奨関数を削除
> - &gt;= 2.0: `kotlinx.*` パッケージのAPIを別のライブラリに移動

### 一部のJS専用APIの非推奨化

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース
>
> **Short summary**: 標準ライブラリの一部のJS専用関数が削除のために非推奨とされます。これらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を受け取る配列の `sort` 関数（例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`) が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告とともに非推奨に
> - 1.9.0: 非推奨レベルをエラーに昇格
> - &gt;=2.0: 公開APIから非推奨関数を削除

## ツール

### Gradleセットアップからの `enableEndorsedLibs` フラグの削除

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: Gradleセットアップでは `enableEndorsedLibs` フラグはサポートされなくなります。
>
> **Deprecation cycle**:
>
> - < 1.9.0: Gradleセットアップで `enableEndorsedLibs` フラグがサポートされる
> - 1.9.0: Gradleセットアップで `enableEndorsedLibs` フラグが**サポートされない**

### Gradleの規約の削除

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: Gradleの規約はGradle 7.1で非推奨となり、Gradle 8で削除されました。
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradleの規約を非推奨に
> - 1.9.0: Gradleの規約を削除

### `KotlinCompile` タスクの `classpath` プロパティの削除

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: `KotlinCompile` タスクの `classpath` プロパティが削除されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` プロパティが非推奨に
> - 1.8.0: 非推奨レベルをエラーに昇格
> - 1.9.0: 公開APIから非推奨関数を削除

### `kotlin.internal.single.build.metrics.file` プロパティの非推奨化

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース
>
> **Short summary**: ビルドレポート用の単一ファイルを定義するために使用される `kotlin.internal.single.build.metrics.file` プロパティを非推奨にします。
> 代わりに、`kotlin.build.report.output=single_file` とともにプロパティ `kotlin.build.report.single_file` を使用してください。
>
> **Deprecation cycle:**
>
> * 1.8.0: 非推奨レベルを警告に昇格
> * &gt;= 1.9: プロパティを削除
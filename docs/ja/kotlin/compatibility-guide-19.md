[//]: # (title: Kotlin 1.9 互換性ガイド)

_[現代的な言語を維持する](kotlin-evolution-principles.md)_ および _[快適な更新](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則の1つです。前者は、言語進化を妨げる構文は削除されるべきだと述べ、後者は、コードの移行を可能な限り円滑にするために、この削除が事前に十分に周知されるべきだと述べています。

言語の変更点のほとんどは、更新履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてを要約し、Kotlin 1.8 から Kotlin 1.9 への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

-   _ソース互換性 (source-incompatible)_: ソース互換性のない変更により、以前は問題なくコンパイル（エラーや警告なし）できていたコードがコンパイルできなくなります。
-   _バイナリ互換性 (binary-compatible)_: 2つのバイナリ成果物がバイナリ互換性があるとは、それらを交換してもロードエラーやリンケージエラーが発生しない場合を指します。
-   _振る舞い互換性 (behavioral-incompatible)_: 変更が振る舞い互換性がないとは、同じプログラムが変更適用前後で異なる振る舞いを示す場合を指します。

これらの定義は純粋なKotlinにのみ適用されることに注意してください。他の言語の観点（例：Java）から見たKotlinコードの互換性は、このドキュメントの範囲外です。

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

### 言語バージョン 1.3 のサポート終了

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 は言語バージョン 1.9 を導入し、言語バージョン 1.3 のサポートを削除します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 警告を報告する
> - 1.9.0: 警告をエラーに昇格させる

### スーパーインターフェースの型が関数リテラルの場合のスーパーコンストラクタ呼び出しを禁止

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: インターフェースが関数リテラル型を継承している場合、Kotlin 1.9 はそのようなコンストラクタが存在しないため、スーパーコンストラクタ呼び出しを禁止します。
>
> **Deprecation cycle**:
> * 1.7.0: 警告を報告する（プログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格させる

### アノテーションパラメータの型における循環を禁止

> **Issue**: [KT-47932](https://youtrack.com/issue/KT-47932)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 は、アノテーションの型が、直接的または間接的に、そのパラメータ型の1つとして使用されることを禁止します。これにより、循環が作成されるのを防ぎます。
> ただし、アノテーション型の `Array` または `vararg` であるパラメータ型を持つことは許可されています。
>
> **Deprecation cycle**:
> * 1.7.0: アノテーションパラメータの型における循環について警告を報告する（プログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ProhibitCyclesInAnnotations` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。

### パラメータのない関数型における @ExtensionFunctionType アノテーションの使用を禁止

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 は、パラメータのない関数型、または関数型ではない型に `@ExtensionFunctionType` アノテーションを使用することを禁止します。
>
> **Deprecation cycle**:
> * 1.7.0: 関数型ではない型に対するアノテーションについて警告を報告する。関数型に対するアノテーションについてエラーを報告する。
> * 1.9.0: 関数型に対する警告をエラーに昇格させる。

### 代入時のJavaフィールド型の不一致を禁止

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 は、Javaフィールドに代入された値の型が、そのJavaフィールドの投影された型と一致しない場合、コンパイラエラーを報告します。
>
> **Deprecation cycle**:
> * 1.6.0: 投影されたJavaフィールドの型が代入された値の型と一致しない場合に警告を報告する（プログレッシブモードではエラー）
> * 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。

### プラットフォーム型のNull許容性アサーション例外におけるソースコード抜粋の削除

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.9 では、式におけるnullチェックによって生成される例外メッセージに、ソースコードの抜粋が含まれなくなります。代わりに、メソッドまたはフィールドの名前が表示されます。
> 式がメソッドまたはフィールドでない場合、メッセージに追加情報は提供されません。
>
> **Deprecation cycle**:
> * < 1.9.0: 式におけるnullチェックによって生成される例外メッセージには、ソースコードの抜粋が含まれる
> * 1.9.0: 式におけるnullチェックによって生成される例外メッセージには、メソッドまたはフィールドの名前のみが含まれる。`-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。

### スーパークラスの抽象メンバーへのスーパーコール委譲を禁止

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、明示的または暗黙的なスーパーコールがスーパークラスの_抽象_メンバーに委譲される場合にコンパイルエラーを報告するようになります。これは、スーパーインターフェースにデフォルト実装がある場合でも同様です。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用された場合に警告を導入する
> - 1.7.0: スーパーコールが実際にスーパークラスの抽象メンバーにアクセスする場合に警告を報告する
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` の互換性モードが有効な場合、影響を受けるすべての場合にエラーを報告する。プログレッシブモードでもエラーを報告する。
> - 1.8.0: スーパークラスの抽象メソッドがオーバーライドされていない具象クラスの宣言の場合、および Any メソッドのスーパーコールがスーパークラスで抽象としてオーバーライドされている場合にエラーを報告する
> - 1.9.0: 明示的な抽象メソッドへのスーパーコールを含む、影響を受けるすべての場合にエラーを報告する

### when-with-subject における紛らわしい文法を非推奨化

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 では、`when`条件式におけるいくつかの紛らわしい文法構造が非推奨化されました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式に非推奨警告を導入する
> - 1.8.0: この警告をエラーに昇格させる。`-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` を使用して一時的に 1.8 より前の振る舞いに戻すことができます。
> - &gt;= 2.1: 非推奨の構文の一部を新しい言語機能のために再利用する

### 異なる数値型間の暗黙的な型強制を防止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin は、意味的にその型へのダウンキャストのみが必要な場合、数値が自動的にプリミティブ数値型に変換されるのを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべての場合で古い振る舞い
> - 1.5.30: 生成されたプロパティデリゲートアクセサーにおけるダウンキャストの振る舞いを修正する。`-Xuse-old-backend` を使用して一時的に 1.5.30 より前の修正された振る舞いに戻すことができます。
> - &gt;= 2.0: その他の影響を受けるケースにおけるダウンキャストの振る舞いを修正する

### ジェネリック型エイリアスの使用における上限違反の禁止（エイリアスされた型の型引数のジェネリック型引数で使用される型パラメータ）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、型エイリアスの型パラメータがエイリアスされた型の型引数のジェネリック型引数として使用される場合（例: `typealias Alias<T> = Base<List<T>>`）、対応するエイリアスされた型の型パラメータの上限制約に違反する型引数を持つ型エイリアスの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.8.0: ジェネリック型エイリアスの使用に、エイリアスされた型の対応する型パラメータの上限制約に違反する型引数がある場合に警告を報告する
> - 2.0.0: 警告をエラーに昇格させる

### 公開シグネチャにおけるローカル型を近似する際にNull許容性を保持

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 明示的に戻り値の型が指定されていない式本体関数からローカル型または匿名型が返される場合、
> Kotlin コンパイラはその型の既知のスーパータイプを使用して戻り値の型を推論（または近似）します。
> この際、コンパイラはnull値が実際に返される可能性があるにもかかわらず、非null型を推論してしまう可能性があります。
>
> **Deprecation cycle**:
>
> - 1.8.0: フレキシブルな型をフレキシブルなスーパータイプで近似する
> - 1.8.0: Null許容であるべき宣言が非null型に推論された場合に警告を報告し、ユーザーに型を明示的に指定するように促す
> - 2.0.0: Null許容型をNull許容スーパータイプで近似する。`-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` を使用して一時的に 2.0 より前の振る舞いに戻すことができます。

### オーバーライドを通じて非推奨化を伝播させない

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、スーパークラスの非推奨メンバーからサブクラスのオーバーライドメンバーへの非推奨化の伝播を停止します。これにより、スーパークラスのメンバーを非推奨にしながら、サブクラスでは非推奨にしないという明示的なメカニズムが提供されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: 将来の振る舞い変更のメッセージと、この警告を抑制するか、非推奨メンバーのオーバーライドに明示的に `@Deprecated` アノテーションを記述するよう促す警告を報告する
> - 1.9.0: オーバーライドされたメンバーへの非推奨ステータスの伝播を停止する。この変更はプログレッシブモードでもすぐに有効になります。

### アノテーションクラスのパラメータ宣言以外の場所でのコレクションリテラルの使用を禁止

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、アノテーションクラスのパラメータに配列を渡す場合や、これらのパラメータのデフォルト値を指定する場合に、制限された方法でコレクションリテラルの使用を許可しています。
> しかし、それ以外にも、Kotlin はアノテーションクラス内の他の場所、例えばネストされたオブジェクト内でコレクションリテラルを使用することを許可していました。Kotlin 1.9 では、アノテーションクラスのパラメータのデフォルト値以外の場所でのコレクションリテラルの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: アノテーションクラスのネストされたオブジェクト内の配列リテラルについて警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる

### デフォルト値式におけるパラメータの前方参照を禁止

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、他のパラメータのデフォルト値式におけるパラメータの前方参照を禁止します。これにより、デフォルト値式でパラメータにアクセスされるまでに、関数に渡されるか、自身のデフォルト値式によって初期化されるかのいずれかで値が設定されていることが保証されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: デフォルト値を持つパラメータが、それより前の別のパラメータのデフォルト値で参照された場合に警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。

### インライン関数パラメータに対する拡張呼び出しを禁止

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、インライン関数パラメータを別のインライン関数にレシーバーとして渡すことを許可していましたが、そのようなコードをコンパイルすると常にコンパイラ例外が発生していました。
> Kotlin 1.9 ではこれを禁止し、コンパイラがクラッシュする代わりにエラーを報告するようになります。
>
> **Deprecation cycle**:
>
> - 1.7.20: インライン関数パラメータに対するインライン拡張呼び出しについて警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる

### 匿名関数引数を持つ suspend という名前の中置関数の呼び出しを禁止

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、単一の関数型引数を匿名関数リテラルとして渡す `suspend` という名前の中置関数を呼び出すことを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.7.20: 匿名関数リテラルを持つ `suspend` 中置呼び出しについて警告を報告する
> - 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ModifierNonBuiltinSuspendFunError` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。
> - TODO: パーサーによる `suspend fun` トークンシーケンスの解釈方法を変更する

### 内部クラスでの捕捉された型パラメータをその分散に反して使用することを禁止

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、`in` または `out` 分散を持つ外側のクラスの型パラメータが、そのクラスの内部クラスで、その型パラメータの宣言された分散に違反する位置で使用されることを禁止します。
>
> **Deprecation cycle**:
>
> - 1.7.0: 外側のクラスの型パラメータの使用位置がそのパラメータの分散規則に違反する場合に警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。

### 複合代入演算子における明示的な戻り値の型を持たない関数の再帰呼び出しを禁止

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、明示的に戻り値の型が指定されていない関数が、その関数の本体内の複合代入演算子の引数で再帰的に呼び出されることを禁止します。これは現在、その関数の本体内の他の式で禁止されているのと同様です。
>
> **Deprecation cycle**:
>
> - 1.7.0: 明示的に戻り値の型が指定されていない関数が、その関数の本体内の複合代入演算子引数で再帰的に呼び出された場合に警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる

### @NotNull T を期待し、Null許容境界を持つKotlinジェネリックパラメータが与えられた場合の不健全な呼び出しを禁止

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、`@NotNull`アノテーションが付けられたJavaメソッドのパラメータに対して、Null許容性を持つ可能性のあるジェネリック型の値が渡されるメソッド呼び出しを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 非null型が期待される場所で制約のないジェネリック型パラメータが渡された場合に警告を報告する
> - 1.9.0: 上記の警告の代わりに型不一致エラーを報告する。`-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` を使用して一時的に 1.8 より前の振る舞いに戻すことができます。

### enumクラスのエントリ初期化子からのそのenumのコンパニオンメンバーへのアクセスを禁止

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、enumエントリ初期化子からのenumのコンパニオンオブジェクトへのあらゆる種類のアクセスを禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: そのようなコンパニオンメンバーアクセスについて警告を報告する（プログレッシブモードではエラー）
> - 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` を使用して一時的に 1.8 より前の振る舞いに戻すことができます。

### Enum.declaringClass 合成プロパティの非推奨化と削除

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin では、基盤となるJavaクラス `java.lang.Enum` のメソッド `getDeclaringClass()` から生成される `Enum` 値に対して、`declaringClass` という合成プロパティを使用することが許可されていました。このメソッドはKotlin `Enum` 型では利用できないにもかかわらずです。Kotlin 1.9 ではこのプロパティの使用を禁止し、代わりに拡張プロパティ `declaringJavaClass` への移行を提案します。
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` プロパティの使用について警告を報告する（プログレッシブモードではエラー）。`declaringJavaClass` 拡張への移行を提案する。
> - 1.9.0: 警告をエラーに昇格させる。`-XXLanguage:-ProhibitEnumDeclaringClass` を使用して一時的に 1.9 より前の振る舞いに戻すことができます。
> - 2.0.0: `declaringClass` 合成プロパティを削除する

### コンパイラオプション -Xjvm-default の enable および compatibility モードを非推奨化

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 は、`-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードの使用を禁止します。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードについて警告を導入する
> - 1.9.0: この警告をエラーに昇格させる

### ビルダー推論コンテキストにおける型変数の上限への暗黙的な推論を禁止

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.0 では、ビルダー推論ラムダ関数のスコープ内で使用サイトの型情報がない場合、対応する型パラメータの上限への型変数の暗黙的な推論を禁止します。これは現在、他のコンテキストで行われているのと同様です。
>
> **Deprecation cycle**:
>
> - 1.7.20: 使用サイトの型情報がない場合に、型パラメータが宣言された上限に推論されると警告を報告する（プログレッシブモードではエラー）
> - 2.0.0: 警告をエラーに昇格させる

## 標準ライブラリ

### Range/Progression が Collection を実装し始めた場合の潜在的なオーバーロード解決の変更について警告

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 では、標準のプログレッションおよびそれらから継承された具象範囲で `Collection` インターフェースを実装することが計画されています。これにより、あるメソッドに要素を受け取るオーバーロードとコレクションを受け取るオーバーロードの2つがある場合、オーバーロード解決において異なるオーバーロードが選択される可能性があります。
> Kotlin は、そのようなオーバーロードされたメソッドが範囲またはプログレッション引数で呼び出された場合に警告またはエラーを報告することで、この状況を可視化します。
>
> **Deprecation cycle**:
>
> - 1.6.20: 標準のプログレッションまたはその範囲継承型が引数としてオーバーロードされたメソッドで呼び出された場合に警告を報告する。これは、このプログレッション/範囲による `Collection` インターフェースの実装が将来この呼び出しで別のオーバーロードを選択することにつながる場合。
> - 1.8.0: この警告をエラーに昇格させる
> - 2.1.0: エラーの報告を停止し、プログレッションに `Collection` インターフェースを実装して、影響を受けるケースでオーバーロード解決の結果を変更する

### kotlin.dom および kotlin.browser パッケージからの宣言を kotlinx.* へ移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` および `kotlin.browser` パッケージからの宣言は、stdlibからそれらを抽出するための準備として、対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替APIを導入する
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案する
> - 1.6.0: 非推奨レベルをエラーに引き上げる
> - 1.8.20: JS-IRターゲットのstdlibから非推奨の関数を削除する
> - &gt;= 2.0: kotlinx.* パッケージ内のAPIを別のライブラリに移動する

### 一部のJS専用APIを非推奨化

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib のいくつかのJS専用関数が削除のために非推奨化されます。これには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`）が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.9.0: 非推奨レベルをエラーに引き上げる
> - &gt;=2.0: 非推奨の関数を公開APIから削除する

## ツール

### Gradleセットアップから enableEndorsedLibs フラグを削除

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `enableEndorsedLibs` フラグは Gradleセットアップでサポートされなくなります。
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` フラグは Gradleセットアップでサポートされる
> - 1.9.0: `enableEndorsedLibs` フラグは Gradleセットアップで**サポートされない**

### Gradleコンベンションを削除

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradleコンベンションは Gradle 7.1 で非推奨となり、Gradle 8 で削除されました。
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradleコンベンションが非推奨化される
> - 1.9.0: Gradleコンベンションが削除される

### KotlinCompileタスクの classpath プロパティを削除

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` タスクの `classpath` プロパティが削除されます。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` プロパティが非推奨になる
> - 1.8.0: 非推奨レベルをエラーに引き上げる
> - 1.9.0: 非推奨の関数を公開APIから削除する

### kotlin.internal.single.build.metrics.file プロパティを非推奨化

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: ビルドレポートの単一ファイルを定義するために使用される `kotlin.internal.single.build.metrics.file` プロパティを非推奨にします。
> 代わりに、`kotlin.build.report.output=single_file` とともに `kotlin.build.report.single_file` プロパティを使用してください。
>
> **Deprecation cycle:**
>
> * 1.8.0: 非推奨レベルを警告に引き上げる
> * &gt;= 1.9: プロパティを削除する
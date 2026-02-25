[//]: # (title: Kotlin 1.5.x 互換性ガイド)

「[言語をモダンに保つ](kotlin-evolution-principles.md)」および「[快適なアップデート](kotlin-evolution-principles.md)」は、Kotlin言語設計の基本原則です。前者は言語の進化を妨げる構成要素を削除すべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、その削除を事前によく通知すべきであることを示しています。

ほとんどの言語の変更は、アップデートの変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらをすべてまとめ、Kotlin 1.4 から Kotlin 1.5 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性を紹介します。

- **ソース互換性 (source)**: ソース互換性のない変更により、以前は問題なくコンパイルできていた（エラーや警告が出ていなかった）コードがコンパイルできなくなります。
- **バイナリ互換性 (binary)**: 2つのバイナリアーティファクトを入れ替えても、ロードエラーやリンケージエラーが発生しない場合、それらはバイナリ互換であると言われます。
- **動作互換性 (behavioral)**: 変更の適用前後で、同じプログラムが異なる動作を示す場合、その変更は動作互換性がないと言われます。

これらの定義は、純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語（例：Java）の観点からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語および標準ライブラリ（stdlib）

### シグネチャポリモーフィックな呼び出しにおけるスプレッド演算子の禁止

> **課題**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、シグネチャポリモーフィックな呼び出し (signature-polymorphic calls) におけるスプレッド演算子 (`*`) の使用が禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 呼び出し箇所で問題のある演算子に対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### そのクラスから見えない抽象メンバー（internal/package-private）を含む非抽象クラスの禁止

> **課題**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、そのクラスから見えない（internal または package-private な）抽象メンバーを含む非抽象クラスが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 問題のあるクラスに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### JVM 上で、非 reified 型パラメータに基づく配列を reified 型引数として使用することを禁止

> **課題**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、JVM 上で非 reified（実体化されていない）型パラメータに基づく配列を reified 型引数として使用することが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 問題のある呼び出しに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### プライマリコンストラクタに委譲しない enum クラスのセカンダリコンストラクタを禁止

> **課題**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、プライマリコンストラクタに委譲しない enum クラスのセカンダリコンストラクタが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 問題のあるコンストラクタに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### private な inline 関数からの匿名型の露出を禁止

> **課題**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、private な inline 関数から匿名型を露出させることが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 問題のあるコンストラクタに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### SAM 変換を伴う引数の後に非スプレッド配列を渡すことを禁止

> **課題**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、SAM 変換を伴う引数の後に非スプレッド配列を渡すことが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.3.70: 問題のある呼び出しに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### アンダースコア名の catch ブロックパラメータに対する特別なセマンティクスのサポート

> **課題**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、catch ブロックで例外のパラメータ名を省略するために使用されるアンダースコア記号 (`_`) への参照が禁止されます。
>
> **非推奨サイクル**:
>
> - 1.4.20: 問題のある参照に対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### SAM 変換の実装戦略を匿名クラスベースから invokedynamic に変更

> **課題**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 以降、SAM (Single Abstract Method) 変換の実装戦略が、匿名クラスの生成から `invokedynamic` JVM 命令の使用に変更されます。
>
> **非推奨サイクル**:
>
> - 1.5: SAM 変換の実装戦略を変更。
>  `-Xsam-conversions=class` を使用して、以前の実装方式に戻すことが可能。

### JVM IR ベースのバックエンドにおけるパフォーマンスの問題

> **課題**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 では、Kotlin/JVM コンパイラでデフォルトで [IR ベースのバックエンド](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) が使用されます。以前の言語バージョンでは、引き続き古いバックエンドがデフォルトで使用されます。
>
> Kotlin 1.5 で新しいコンパイラを使用すると、一部でパフォーマンスの低下が発生する可能性があります。現在、そのようなケースの修正に取り組んでいます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: デフォルトで古い JVM バックエンドが使用されます。
> - 1.5 以上: デフォルトで IR ベースのバックエンドが使用されます。Kotlin 1.5 で古いバックエンドを使用する必要がある場合は、プロジェクトの構成ファイルに以下の行を追加して、一時的に 1.5 未満の動作に戻してください。
>
> Gradle の場合:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> Maven の場合:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> このフラグのサポートは、将来のリリースで削除される予定です。

### JVM IR ベースのバックエンドにおける新しいフィールドのソート順

> **課題**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: バージョン 1.5 以降、Kotlin は [IR ベースのバックエンド](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) を使用します。これにより、JVM バイトコードのソート方法が異なります。具体的には、ボディ内で宣言されたフィールドよりも前に、コンストラクタで宣言されたフィールドを生成します（古いバックエンドでは逆でした）。この新しいソート順は、Java シリアライゼーションなど、フィールドの順序に依存するシリアライゼーションフレームワークを使用するプログラムの動作を変更する可能性があります。
>
> **非推奨サイクル**:
>
> - 1.5 未満: デフォルトで古い JVM バックエンドが使用されます。これは、コンストラクタで宣言されたフィールドよりも前に、ボディ内で宣言されたフィールドを配置します。
> - 1.5 以上: デフォルトで新しい IR ベースのバックエンドが使用されます。コンストラクタで宣言されたフィールドが、ボディ内で宣言されたフィールドよりも前に生成されます。回避策として、Kotlin 1.5 で一時的に古いバックエンドに切り替えることができます。そのためには、プロジェクトの構成ファイルに以下の行を追加してください。
>
> Gradle の場合:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> Maven の場合:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> このフラグのサポートは、将来のリリースで削除される予定です。

### 委譲式にジェネリックな呼び出しを含む委譲プロパティに対する null 許容性の assertion の生成

> **課題**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 以降、Kotlin コンパイラは委譲式にジェネリックな呼び出しを含む委譲プロパティに対して null 許容性の assertion を出力します。
>
> **非推奨サイクル**:
>
> - 1.5: 委譲プロパティに対して null 許容性の assertion を出力（詳細は課題を参照）。
>  `-Xuse-old-backend` または `-language-version 1.4` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### @OnlyInputTypes でアノテーションされた型パラメータを持つ呼び出しの警告をエラーに変更

> **課題**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 では、型安全性を向上させるため、無意味な引数を伴う `contains`、`indexOf`、`assertEquals` などの呼び出しが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.4.0: 問題のあるコンストラクタに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-StrictOnlyInputTypesChecks` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### 名前付き vararg を伴う呼び出しにおける正しい引数実行順序の使用

> **課題**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 では、名前付き vararg（可変長引数）を伴う呼び出しにおける引数の実行順序が変更されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 問題のあるコンストラクタに対して警告を導入
> - 1.5 以上: この警告をエラーに引き上げ。
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### 演算子の関数呼び出しにおけるパラメータのデフォルト値の使用

> **課題**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 では、演算子呼び出しにおいてパラメータのデフォルト値が使用されるようになります。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 古い動作（詳細は課題を参照）
> - 1.5 以上: 動作が変更。
>  `-XXLanguage:-JvmIrEnabledByDefault` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### 通常のプログレッションが空の場合、for ループ内で空の逆プログレッションを生成

> **課題**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 では、通常のプログレッション（進行）が空の場合、for ループにおいて空の逆プログレッション (reversed progression) が生成されるようになります。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 古い動作（詳細は課題を参照）
> - 1.5 以上: 動作が変更。
>  `-XXLanguage:-JvmIrEnabledByDefault` を使用して、一時的に 1.5 未満の動作に戻すことが可能。

### Char からコード、および Char から数字への変換の整理

> **課題**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 以降、Char から数値型への変換が非推奨になります。
>
> **非推奨サイクル**:
>
> - 1.5: `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` および `Long.toChar()` のような逆変換関数を非推奨にし、代替案を提示。

### kotlin.text 関数における文字の大文字小文字を区別しない比較の不整合

> **課題**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: 動作
>
> **概要**: Kotlin 1.5 以降、`Char.equals` の大文字小文字を区別しない比較が改善されます。まず文字の大文字版が等しいかどうかを比較し、次にそれら大文字版の小文字版（文字そのものではなく）が等しいかどうかを比較するように変更されます。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 古い動作（詳細は課題を参照）
> - 1.5: `Char.equals` 関数の動作を変更。

### デフォルトのロケールに依存する大文字小文字変換 API の削除

> **課題**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.5 以降、`String.toUpperCase()` のようなデフォルトのロケールに依存する大文字小文字変換関数が非推奨になります。
>
> **非推奨サイクル**:
>
> - 1.5: デフォルトのロケールを使用する大文字小文字変換関数を非推奨にし（詳細は課題を参照）、代替案を提示。

### コレクションの min および max 関数の戻り値の型を段階的に非 null に変更

> **課題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **コンポーネント**: kotlin-stdlib (JVM)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: コレクションの `min` および `max` 関数の戻り値の型は、1.6 で非 null に変更されます。
>
> **非推奨サイクル**:
>
> - 1.4: 同義語として `...OrNull` 関数を導入し、影響を受ける API を非推奨化（詳細は課題を参照）。
> - 1.5.0: 影響を受ける API の非推奨レベルをエラーに引き上げ。
> - 1.6 以上: 影響を受ける API を再導入するが、戻り値の型を非 null に変更。

### 浮動小数点型から Short および Byte への変換の非推奨レベルの引き上げ

> **課題**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **コンポーネント**: kotlin-stdlib (JVM)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.4 で `WARNING` レベルで非推奨となった浮動小数点型から `Short` および `Byte` への変換は、Kotlin 1.5.0 以降エラーになります。
>
> **非推奨サイクル**:
>
> - 1.4: `Double.toShort()/toByte()` および `Float.toShort()/toByte()` を非推奨にし、代替案を提示。
> - 1.5.0: 非推奨レベルをエラーに引き上げ。

## ツール

### 単一のプロジェクト内で複数の kotlin-test の JVM バリアントを混在させない

> **課題**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: 動作
>
> **概要**: 以前は、異なるテストフレームワーク用の相互に排他的な `kotlin-test` バリアントが、推移的依存関係によって 1 つのプロジェクト内に複数存在する可能性がありました。1.5.0 以降、Gradle では異なるテストフレームワーク用の相互に排他的な `kotlin-test` バリアントを保持できなくなります。
>
> **非推奨サイクル**:
>
> - 1.5 未満: 異なるテストフレームワーク用の複数の相互に排他的な `kotlin-test` バリアントを持つことが許可されます。
> - 1.5 以上: 動作が変更。
> Gradle は "Cannot select module with conflict on capability..." のような例外をスローします。考えられる解決策：
>    * 推移的依存関係が持ってくるものと同じ `kotlin-test` バリアントおよび対応するテストフレームワークを使用する。
>    * `kotlin-test` バリアントを推移的に持たせない別のバージョンの依存関係を探し、使用したいテストフレームワークを使用できるようにする。
>    * 使用したいテストフレームワークと同じものを使用する別のバリアントの依存関係を探す。
>    * 推移的に持ち込まれるテストフレームワークを除外する。以下は JUnit 4 を除外する例です。
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      テストフレームワークを除外した後、アプリケーションをテストしてください。動作しなくなった場合は、除外設定を元に戻し、ライブラリと同じテストフレームワークを使用するようにして、自身のテストフレームワークを除外してください。
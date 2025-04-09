---
title: "Kotlin 1.5 の互換性ガイド"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構造は削除されるべきであると述べており、後者は、コードの移行をできるだけスムーズにするために、この削除は事前に十分に周知されるべきであると述べています。

言語の変更のほとんどは、更新の変更ログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめて、Kotlin 1.4からKotlin 1.5への移行に関する完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース互換性）: ソース互換性のない変更とは、以前は問題なく（エラーや警告なしに）コンパイルされていたコードがコンパイルできなくなる変更のことです。
- _binary_（バイナリ互換性）: 2つのバイナリ成果物がバイナリ互換性を持つとは、それらを交換しても、ロードまたはリンケージエラーが発生しないことを意味します。
- _behavioral_（動作互換性）: 変更が動作互換性がないとは、同じプログラムが変更を適用する前と後で異なる動作を示す場合を意味します。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。Kotlinコードの他の言語からの互換性
(たとえば、Javaから) は、このドキュメントの範囲外です。

## 言語とstdlib

### signature-polymorphicな呼び出しにおけるスプレッド演算子の禁止

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、signature-polymorphicな呼び出しにおけるスプレッド演算子（*）の使用を禁止します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のある演算子に対して、呼び出し元で警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` を使用すると、一時的に1.5より前の動作に戻すことができます

### 抽象メンバーを含む非抽象クラス（そのクラスから見えないinternal/package-private）の禁止

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、抽象メンバーを含む非抽象クラス（そのクラスから見えないinternal/package-private）を禁止します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のあるクラスに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` を使用すると、一時的に1.5より前の動作に戻すことができます

### JVMで、非reified型パラメーターに基づく配列をreified型引数として使用することの禁止

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、JVMで、非reified型パラメーターに基づく配列をreified型引数として使用することを禁止します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のある呼び出しに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` を使用すると、一時的に1.5より前の動作に戻すことができます

### プライマリコンストラクターに委譲しないセカンダリenumクラスコンストラクターの禁止

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、プライマリコンストラクターに委譲しないセカンダリenumクラスコンストラクターを禁止します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のあるコンストラクターに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` を使用すると、一時的に1.5より前の動作に戻すことができます

### プライベートインライン関数からの匿名型の公開の禁止

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、プライベートインライン関数からの匿名型の公開を禁止します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のあるコンストラクターに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` を使用すると、一時的に1.5より前の動作に戻すことができます

### SAM変換を伴う引数の後に、非スプレッド配列を渡すことの禁止

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、SAM変換を伴う引数の後に、非スプレッド配列を渡すことを禁止します
>
> **Deprecation cycle**:
>
> - 1.3.70: 問題のある呼び出しに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` を使用すると、一時的に1.5より前の動作に戻すことができます

### アンダースコアで名前が付けられたcatchブロックパラメーターに対する特別なセマンティクスのサポート

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、catchブロック内の例外のパラメーター名を省略するために使用されるアンダースコア記号(`_`)への参照を禁止します
>
> **Deprecation cycle**:
>
> - 1.4.20: 問題のある参照に対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` を使用すると、一時的に1.5より前の動作に戻すことができます

### SAM変換の実装戦略を匿名クラスベースからinvokedynamicに変更

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5以降、SAM (単一抽象メソッド) 変換の実装戦略は、匿名クラスの生成から`invokedynamic` JVM命令の使用に変更されます
>
> **Deprecation cycle**:
>
> - 1.5: SAM変換の実装戦略を変更します。`-Xsam-conversions=class` を使用すると、以前に使用していたスキームに実装を戻すことができます

### JVM IRベースのバックエンドに関するパフォーマンスの問題

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5では、Kotlin/JVMコンパイラーの[IRベースのバックエンド](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)をデフォルトで使用します。古いバックエンドは、以前の言語バージョンではデフォルトで使用されています。
>
> Kotlin 1.5で新しいコンパイラーを使用すると、パフォーマンスが低下する問題が発生する可能性があります。このようなケースの修正に取り組んでいます。
>
> **Deprecation cycle**:
>
> - < 1.5: デフォルトでは、古いJVMバックエンドが使用されます
> - &gt;= 1.5: デフォルトでは、IRベースのバックエンドが使用されます。Kotlin 1.5で古いバックエンドを使用する必要がある場合は、プロジェクトの構成ファイルに次の行を追加して、一時的に1.5より前の動作に戻します。
>
> Gradleの場合：
>
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
>
> Mavenの場合：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> このフラグのサポートは、今後のリリースで削除されます。

### JVM IRベースのバックエンドでの新しいフィールドソート

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: バージョン1.5以降、Kotlinは[IRベースのバックエンド](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)を使用します。
> これは、JVMバイトコードを異なる方法でソートします。コンストラクターで宣言されたフィールドを、本体で宣言されたフィールドの前に生成します。
> 一方、古いバックエンドでは逆になります。新しいソートは、フィールドの順序に依存するJavaシリアル化などのシリアル化フレームワークを使用するプログラムの動作を変更する可能性があります。
>
> **Deprecation cycle**:
>
> - < 1.5: デフォルトでは、古いJVMバックエンドが使用されます。本体で宣言されたフィールドが、コンストラクターで宣言されたフィールドの前にあります。
> - &gt;= 1.5: デフォルトでは、新しいIRベースのバックエンドが使用されます。コンストラクターで宣言されたフィールドが、本体で宣言されたフィールドの前に生成されます。回避策として、Kotlin 1.5で一時的に古いバックエンドに切り替えることができます。そのためには、プロジェクトの構成ファイルに次の行を追加します。
>
> Gradleの場合：
>
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
>
> Mavenの場合：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> このフラグのサポートは、今後のリリースで削除されます。

### デリゲート式でジェネリック呼び出しを使用するデリゲートプロパティのnull可能性アサーションを生成する

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5以降、Kotlinコンパイラーは、デリゲート式でジェネリック呼び出しを使用するデリゲートプロパティのnull可能性アサーションを出力します
>
> **Deprecation cycle**:
>
> - 1.5: デリゲートプロパティのnull可能性アサーションを出力します (詳細はissueを参照してください)。`-Xuse-old-backend` または `-language-version 1.4` を使用すると、一時的に1.5より前の動作に戻すことができます

### @OnlyInputTypesでアノテーションが付けられた型パラメーターを持つ呼び出しに対して警告をエラーに変える

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5では、型安全性を向上させるために、`contains`、`indexOf`、`assertEquals`などの無意味な引数を持つ呼び出しを禁止します
>
> **Deprecation cycle**:
>
> - 1.4.0: 問題のあるコンストラクターに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-StrictOnlyInputTypesChecks` を使用すると、一時的に1.5より前の動作に戻すことができます

### 名前付き可変長引数を使用した呼び出しで、引数の実行順序を正しく使用する

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5では、名前付き可変長引数を使用した呼び出しで、引数の実行順序を変更します
>
> **Deprecation cycle**:
>
> - < 1.5: 問題のあるコンストラクターに対して警告を表示します
> - &gt;= 1.5: この警告をエラーに引き上げます。`-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` を使用すると、一時的に1.5より前の動作に戻すことができます

### 演算子関数呼び出しでパラメーターのデフォルト値を使用する

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5では、演算子呼び出しでパラメーターのデフォルト値を使用します
>
> **Deprecation cycle**:
>
> - < 1.5: 古い動作 (詳細はissueを参照してください)
> - &gt;= 1.5: 動作が変更されました。`-XXLanguage:-JvmIrEnabledByDefault` を使用すると、一時的に1.5より前の動作に戻すことができます

### 通常の進行が空の場合、forループで空の逆順進行を生成する

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5では、通常の進行が空の場合、forループで空の逆順進行を生成します
>
> **Deprecation cycle**:
>
> - < 1.5: 古い動作 (詳細はissueを参照してください)
> - &gt;= 1.5: 動作が変更されました。`-XXLanguage:-JvmIrEnabledByDefault` を使用すると、一時的に1.5より前の動作に戻すことができます

### Charからコードへの変換とCharから数字への変換を整理する

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5以降、Charから数値型への変換は非推奨になります
>
> **Deprecation cycle**:
>
> - 1.5: `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` および `Long.toChar()` などの逆関数を非推奨にし、代替を提案します

### kotlin.text関数における文字の大文字と小文字を区別しない比較の一貫性の欠如

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5以降、`Char.equals` は、最初に対象の文字の大文字バリアントが等しいかどうかを比較し、次にそれらの大文字バリアントの小文字バリアント (文字自体とは対照的に) が等しいかどうかを比較することにより、大文字と小文字を区別しない場合に改善されます
>
> **Deprecation cycle**:
>
> - < 1.5: 古い動作 (詳細はissueを参照してください)
> - 1.5: `Char.equals` 関数の動作を変更します

### デフォルトのロケール依存の大文字小文字変換APIの削除

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5以降、`String.toUpperCase()` などのデフォルトのロケール依存の大文字小文字変換関数は非推奨になります
>
> **Deprecation cycle**:
>
> - 1.5: デフォルトのロケールを使用した大文字小文字変換関数を非推奨にし (詳細はissueを参照してください)、代替を提案します

### コレクションのmin関数とmax関数の戻り型を非null可能に段階的に変更する

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: コレクションの `min` 関数と `max` 関数の戻り型は、1.6で非null可能に変更されます
>
> **Deprecation cycle**:
>
> - 1.4: `...OrNull` 関数を同義語として導入し、影響を受けるAPIを非推奨にします (詳細はissueを参照してください)
> - 1.5.0: 影響を受けるAPIの非推奨レベルをエラーに引き上げます
> - &gt;=1.6: 影響を受けるAPIを再導入しますが、戻り型は非null可能です

### 浮動小数点型からShortおよびByteへの変換の非推奨レベルを引き上げる

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4で `WARNING` レベルで非推奨になった浮動小数点型から `Short` および `Byte` への変換は、Kotlin 1.5.0以降はエラーを引き起こします。
>
> **Deprecation cycle**:
>
> - 1.4: `Double.toShort()/toByte()` および `Float.toShort()/toByte()` を非推奨にし、代替を提案します
> - 1.5.0: 非推奨レベルをエラーに引き上げます

## ツール

### 単一のプロジェクトでkotlin-testの複数のJVMバリアントを混在させないでください

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 異なるテストフレームワーク用のいくつかの相互排他的な `kotlin-test` バリアントは、トランジティブ依存関係によってプロジェクトに含まれている可能性があります。1.5.0以降、Gradleでは、異なるテストフレームワーク用の相互排他的な `kotlin-test` バリアントを持つことは許可されません。
>
> **Deprecation cycle**:
>
> - < 1.5: 異なるテストフレームワーク用のいくつかの相互排他的な `kotlin-test` バリアントを持つことが許可されます
> - &gt;= 1.5: 動作が変更されました。
> Gradleは、「Cannot select module with conflict on capability...」のような例外をスローします。考えられる解決策:
>    * トランジティブ依存関係がもたらすのと同じ `kotlin-test` バリアントと対応するテストフレームワークを使用します。
>    * `kotlin-test` バリアントをトランジティブにもたらさない依存関係の別のバリアントを見つけて、使用したいテストフレームワークを使用できるようにします。
>    * 使用したいのと同じテストフレームワークを使用する別の `kotlin-test` バリアントをトランジティブにもたらす依存関係の別のバリアントを見つけます。
>    * トランジティブにもたらされるテストフレームワークを除外します。次の例は、JUnit 4を除外するためのものです。
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      テストフレームワークを除外した後、アプリケーションをテストします。動作しなくなった場合は、除外の変更をロールバックし、ライブラリと同じテストフレームワークを使用し、自分のテストフレームワークを除外します。
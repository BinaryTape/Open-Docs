---
title: "Kotlin 2.1 互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlinの言語設計における基本原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行を可能な限りスムーズにするために、この削除は事前に十分に周知されるべきであるとしています。

言語変更のほとんどは、アップデートの変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめて、Kotlin 2.0からKotlin 2.1への移行に関する完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース互換性）: ソース非互換の変更は、以前は（エラーや警告なしに）正常にコンパイルされていたコードがコンパイルできなくなるようにします
- _binary_（バイナリ互換性）: 2つのバイナリ成果物を交換しても、ロードまたはリンケージエラーが発生しない場合、それらはバイナリ互換性があると言えます
- _behavioral_（動作互換性）: 変更を適用する前と後で同じプログラムが異なる動作を示す場合、その変更は動作非互換であると言えます

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。他の言語の観点からのKotlinコードの互換性（たとえば、Javaからの場合）は、このドキュメントの範囲外です。

## 言語

### 言語バージョン 1.4 および 1.5 の削除

> **Issue**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.1 では言語バージョン 2.1 が導入され、言語バージョン 1.4 および 1.5 のサポートが削除されます。言語バージョン 1.6 および 1.7 は非推奨になります。
>
> **Deprecation cycle**:
>
> - 1.6.0: 言語バージョン 1.4 に対して警告を報告
> - 1.9.0: 言語バージョン 1.5 に対して警告を報告
> - 2.1.0: 言語バージョン 1.6 および 1.7 に対して警告を報告。言語バージョン 1.4 および 1.5 に対して警告をエラーに昇格

### Kotlin/Native での `typeOf()` 関数の動作の変更

> **Issue**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/Native での `typeOf()` 関数の動作が Kotlin/JVM と整合するように調整され、プラットフォーム間の一貫性が確保されます。
>
> **Deprecation cycle**:
>
> - 2.1.0: Kotlin/Native での `typeOf()` 関数の動作を整合

### 型パラメータの境界を介した型の公開の禁止

> **Issue**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 型パラメータの境界を介して可視性の低い型を公開することが禁止され、型の可視性ルールにおける不整合が解消されます。
> この変更により、型パラメータの境界がクラスと同じ可視性ルールに従うようになり、JVM での IR 検証エラーなどの問題を防ぎます。
>
> **Deprecation cycle**:
>
> - 2.1.0: 可視性の低い型パラメータの境界を介して型を公開することに対して警告を報告
> - 2.2.0: 警告をエラーに昇格

### 同じ名前の抽象 `var` プロパティと `val` プロパティの継承の禁止

> **Issue**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: クラスがインターフェースから抽象 `var` プロパティを継承し、スーパークラスから同じ名前の `val` プロパティを継承する場合、
> コンパイルエラーが発生するようになりました。これにより、このような場合のセッターの欠落によって発生するランタイムクラッシュが解決されます。
>
> **Deprecation cycle**:
>
> - 2.1.0: クラスがインターフェースから抽象 `var` プロパティを継承し、スーパークラスから同じ名前の `val` プロパティを継承する場合に警告（またはプログレッシブモードではエラー）を報告
> - 2.2.0: 警告をエラーに昇格

### 初期化されていない enum エントリへのアクセス時にエラーを報告

> **Issue**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: コンパイラは、enum クラスまたはエントリの初期化中に初期化されていない enum エントリにアクセスすると、エラーを報告するようになりました。
> これにより、動作がメンバープロパティの初期化ルールと整合し、ランタイム例外を防ぎ、一貫性のあるロジックを保証します。
>
> **Deprecation cycle**:
>
> - 2.1.0: 初期化されていない enum エントリへのアクセス時にエラーを報告

### K2 スマートキャストの伝播の変更

> **Issue**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: K2 コンパイラは、`val x = y` のような推論された変数に対して型情報の双方向伝播を導入することにより、スマートキャストの伝播の動作を変更します。`val x: T = y` のような明示的に型指定された変数は、
> 型情報を伝播しなくなり、宣言された型へのより厳密な準拠を保証します。
>
> **Deprecation cycle**:
>
> - 2.1.0: 新しい動作を有効化

### Java サブクラスでのメンバー拡張プロパティのオーバーライドの処理を修正

> **Issue**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Java サブクラスによってオーバーライドされたメンバー拡張プロパティのゲッターは、サブクラスのスコープで非表示になり、
> 通常の Kotlin プロパティと同様の動作になります。
>
> **Deprecation cycle**:
>
> - 2.1.0: 新しい動作を有効化

### protected val をオーバーライドする var プロパティのゲッターとセッターの可視性調整を修正

> **Issue**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **Component**: Core language
>
> **Incompatible change type**: binary
>
> **Short summary**: `protected val` プロパティをオーバーライドする `var` プロパティのゲッターとセッターの可視性が一貫性を持つようになり、両方ともオーバーライドされた `val` プロパティの可視性を継承します。
>
> **Deprecation cycle**:
>
> - 2.1.0: K2 でゲッターとセッターの両方に対して一貫した可視性を強制。K1 は影響を受けません

### JSpecify nullability の不一致診断の重大度をエラーに引き上げ

> **Issue**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: `@NonNull`、`@Nullable`、`@NullMarked` などの `org.jspecify.annotations` からの nullability の不一致が、警告ではなくエラーとして扱われるようになり、
> Java 相互運用性に対するより厳密な型の安全性が強制されます。これらの診断の重大度を調整するには、`-Xnullability-annotations` コンパイラオプションを使用します。
>
> **Deprecation cycle**:
>
> - 1.6.0: nullability の潜在的な不一致に対して警告を報告
> - 1.8.20: 警告を特定の JSpecify アノテーション（`@Nullable`、`@NullnessUnspecified`、`@NullMarked`、および `org.jspecify.nullness`（JSpecify 0.2 以前）のレガシーアノテーション）に拡張
> - 2.0.0: `@NonNull` アノテーションのサポートを追加
> - 2.1.0: JSpecify アノテーションのデフォルトモードを `strict` に変更し、警告をエラーに変換。デフォルトの動作をオーバーライドするには、`-Xnullability-annotations=@org.jspecify.annotations:warning` または `-Xnullability-annotations=@org.jspecify.annotations:ignore` を使用

### あいまいなケースで、オーバーロード解決が invoke 呼び出しよりも拡張関数を優先するように変更

> **Issue**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: オーバーロード解決は、あいまいなケースで常に invoke 呼び出しよりも拡張関数を優先するようになりました。
> これにより、ローカル関数とプロパティの解決ロジックにおける不整合が解決されます。この変更は、再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません。
>
> **Deprecation cycle**:
>
> - 2.1.0: オーバーロード解決を変更して、シグネチャが一致する拡張関数に対して、`invoke` 呼び出しよりも拡張関数を常に優先するようにします。この変更は再コンパイル後にのみ適用され、プリコンパイルされたバイナリには影響しません

### JDK 関数インターフェースの SAM コンストラクターでラムダから Nullable な値を返すことを禁止

> **Issue**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: JDK 関数インターフェースの SAM コンストラクターでラムダから Nullable な値を返すことは、指定された型引数が Non-Nullable の場合、コンパイルエラーを引き起こすようになりました。
> これにより、Nullability の不一致がランタイム例外につながる可能性のある問題が解決され、より厳密な型の安全性が保証されます。
>
> **Deprecation cycle**:
>
> - 2.0.0: JDK 関数インターフェースの SAM コンストラクターで Nullable な戻り値に対する非推奨の警告を報告
> - 2.1.0: デフォルトで新しい動作を有効化

### Kotlin/Native での public メンバーと競合する private メンバーの処理を修正

> **Issue**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/Native では、private メンバーはスーパークラスの public メンバーをオーバーライドまたは競合しなくなり、Kotlin/JVM との動作が一致します。
> これにより、オーバーライドの解決における不整合が解決され、個別のコンパイルによって引き起こされる予期しない動作が排除されます。
>
> **Deprecation cycle**:
>
> - 2.1.0: Kotlin/Native の private 関数とプロパティは、スーパークラスの public メンバーをオーバーライドまたは影響を与えなくなり、JVM の動作と一致します

### public インライン関数での private operator 関数へのアクセスを禁止

> **Issue**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()`、`next()` などの private operator 関数は、public インライン関数ではアクセスできなくなりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: public インライン関数での private operator 関数へのアクセスに対して非推奨の警告を報告
> - 2.1.0: 警告をエラーに昇格

### @UnsafeVariance でアノテーションされた不変パラメータへの無効な引数の受け渡しを禁止

> **Issue**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: コンパイラは、型チェック中に `@UnsafeVariance` アノテーションを無視するようになり、不変型パラメータに対するより厳密な型の安全性を強制します。
> これにより、予期される型チェックをバイパスするために `@UnsafeVariance` に依存する無効な呼び出しを防ぎます。
>
> **Deprecation cycle**:
>
> - 2.1.0: 新しい動作を有効化

### 警告レベルの Java 型のエラーレベルの Nullable 引数に対する Nullability エラーを報告

> **Issue**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: コンパイラは、警告レベルの
> Nullable 型に、より厳密なエラーレベルの Nullability を持つ型引数が含まれている Java メソッドで、Nullability の不一致を検出するようになりました。
> これにより、型引数で以前に無視されていたエラーが正しく報告されるようになります。
>
> **Deprecation cycle**:
>
> - 2.0.0: より厳密な型引数を持つ Java メソッドでの Nullability の不一致に対して非推奨の警告を報告
> - 2.1.0: 警告をエラーに昇格

### アクセスできない型の暗黙的な使用を報告

> **Issue**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: コンパイラは、関数リテラルと型引数でアクセスできない型の使用を報告するようになり、
> 不完全な型情報によって引き起こされるコンパイルとランタイムの失敗を防ぎます。
>
> **Deprecation cycle**:
>
> - 2.0.0: アクセスできない非ジェネリック型パラメータまたはレシーバを持つ関数リテラル、およびアクセスできない型引数を持つ型に対して警告を報告。アクセスできないジェネリック型パラメータまたはレシーバを持つ関数リテラル、および特定のシナリオでアクセスできないジェネリック型引数を持つ型に対してエラーを報告
> - 2.1.0: アクセスできない非ジェネリック型パラメータとレシーバを持つ関数リテラルに対する警告をエラーに昇格
> - 2.2.0: アクセスできない型引数を持つ型に対する警告をエラーに昇格

## 標準ライブラリ

### Char と String のロケール依存の大文字と小文字の変換関数を非推奨

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 他の Kotlin 標準ライブラリ API の中でも、`Char.toUpperCase()` や `String.toLowerCase()` などの `Char` と `String` のロケール依存の大文字と小文字の変換関数は非推奨になりました。
> これらを `String.lowercase()` のようなロケールに依存しない代替手段に置き換えるか、`String.lowercase(Locale.getDefault())` のようにロケールに依存する動作に対してロケールを明示的に指定してください。
>
> Kotlin 2.1.0 で非推奨になった Kotlin 標準ライブラリ API の包括的なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) を参照してください。
>
> **Deprecation cycle**:
>
> - 1.4.30: ロケールに依存しない代替手段を実験的 API として導入
> - 1.5.0: 警告付きでロケール依存の大文字と小文字の変換関数を非推奨
> - 2.1.0: 警告をエラーに昇格

### kotlin-stdlib-common JAR アーティファクトの削除

> **Issue**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: binary
>
> **Short summary**: 以前はレガシーマルチプラットフォーム宣言メタデータに使用されていた `kotlin-stdlib-common.jar` アーティファクトは非推奨となり、共通マルチプラットフォーム宣言メタデータの標準形式として `.klib` ファイルに置き換えられます。
> この変更は、メインの `kotlin-stdlib.jar` または `kotlin-stdlib-all.jar` アーティファクトには影響しません。
>
> **Deprecation cycle**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` アーティファクトを非推奨にして削除

### appendln() を非推奨にして appendLine() を推奨

> **Issue**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: `StringBuilder.appendln()` は非推奨となり、`StringBuilder.appendLine()` が推奨されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `appendln()` 関数は非推奨。使用時に警告を報告
> - 2.1.0: 警告をエラーに昇格

### Kotlin/Native での凍結関連の API を非推奨

> **Issue**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 以前に `@FreezingIsDeprecated` アノテーションでマークされていた Kotlin/Native での凍結関連の API は、非推奨になりました。
> これは、スレッド共有のためにオブジェクトを凍結する必要がなくなる新しいメモリマネージャーの導入と一致しています。移行の詳細については、[Kotlin/Native 移行ガイド](native-migration-guide#update-your-code) を参照してください。
>
> **Deprecation cycle**:
>
> - 1.7.20: 警告付きで凍結関連の API を非推奨
> - 2.1.0: 警告をエラーに昇格

### Map.Entry の動作を構造的な変更で fail-fast するように変更

> **Issue**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 関連付けられたマップが構造的に変更された後に `Map.Entry` のキーと値のペアにアクセスすると、`ConcurrentModificationException` がスローされるようになりました。
>
> **Deprecation cycle**:
>
> - 2.1.0: マップの構造的な変更が検出されたときに例外をスロー

## ツール

### KotlinCompilationOutput#resourcesDirProvider を非推奨

> **Issue**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilationOutput#resourcesDirProvider` フィールドは非推奨になりました。
> 追加のリソースディレクトリを追加するには、代わりに Gradle ビルドスクリプトで `KotlinSourceSet.resources` を使用してください。
>
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` は非推奨

### registerKotlinJvmCompileTask(taskName, moduleName) 関数を非推奨

> **Issue**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨になり、
> 新しい `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 関数が推奨されます。この関数は `KotlinJvmCompilerOptions` を受け取るようになりました。
> これにより、通常は拡張機能またはターゲットから `compilerOptions` インスタンスを、タスクのオプションの規約として使用される値とともに渡すことができます。
>
> **Deprecation cycle**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 関数は非推奨

### registerKaptGenerateStubsTask(taskName) 関数を非推奨

> **Issue**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨になりました。
> 代わりに、新しい `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 関数を使用してください。
> この新しいバージョンでは、関連する `KotlinJvmCompile` タスクから値を規約としてリンクできるため、両方のタスクが同じオプションセットを使用していることを確認できます。
>
> **Deprecation cycle**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 関数は非推奨

### KotlinTopLevelExtension および KotlinTopLevelExtensionConfig インターフェースを非推奨

> **Issue**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨になり、新しい `KotlinTopLevelExtension` インターフェースが推奨されます。
> このインターフェースは、API 階層を合理化し、JVM ツールチェーンとコンパイラプロパティへの公式アクセスを提供するために、`KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension`、および `KotlinProjectExtension` をマージします。
>
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig` インターフェースは非推奨

### ビルドランタイム依存関係から kotlin-compiler-embeddable を削除

> **Issue**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin-compiler-embeddable` 依存関係は、Kotlin Gradle Plugin (KGP) のランタイムから削除されました。
> 必要なモジュールは KGP アーティファクトに直接含まれるようになり、Kotlin 言語バージョンは 8.2 未満のバージョンの Gradle Kotlin ランタイムとの互換性をサポートするために 2.0 に制限されています。
>
> **Deprecation cycle**:
>
> - 2.1.0: `kotlin-compiler-embeddable` の使用時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### Kotlin Gradle Plugin API からコンパイラシンボルを非表示

> **Issue**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilerVersion` などの Kotlin Gradle Plugin (KGP) 内にバンドルされているコンパイラモジュールシンボルは、
> ビルドスクリプトでの意図しないアクセスを防ぐために、パブリック API から非表示になります。
>
> **Deprecation cycle**:
>
> - 2.1.0: これらのシンボルへのアクセス時に警告を報告
> - 2.2.0: 警告をエラーに昇格

### 複数の安定性構成ファイルのサポートを追加

> **Issue**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Compose 拡張機能の `stabilityConfigurationFile` プロパティは非推奨になり、
> 複数の構成ファイルを指定できる新しい `stabilityConfigurationFiles` プロパティが推奨されます。
>
> **Deprecation cycle**:
>
> - 2.1.0: `stabilityConfigurationFile` プロパティは非推奨

### 非推奨のプラットフォームプラグイン ID を削除

> **Issue**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 次のプラットフォームプラグイン ID のサポートが削除されました。
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **Deprecation cycle**:
>
> - 1.3: プラットフォームプラグイン ID は非推奨
> - 2.1.0: プラットフォームプラグイン ID はサポートされなくなりました
[//]: # (title: Kotlin 1.7.0 互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin 言語設計の基本原則です。前者は言語の進化を妨げる構成要素を削除すべきであると述べており、後者はその削除を事前に十分に周知し、コードの移行を可能な限りスムーズにすべきであると述べています。

ほとんどの言語変更は、アップデートの変更ログやコンパイラの警告など、他のチャネルですでに発表されていますが、このドキュメントではそれらをすべてまとめ、Kotlin 1.6 から Kotlin 1.7 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、数種類の互換性について紹介します。

- _ソース (source)_: ソース互換性のない変更により、以前は正常にコンパイルできていたコード（エラーや警告なし）がコンパイルできなくなります。
- _バイナリ (binary)_: 2 つのバイナリアーティファクトを入れ替えても、ロードやリンクのエラーが発生しない場合、それらはバイナリ互換であると言われます。
- _振る舞い (behavioral)_: 変更の適用前後で、同じプログラムが異なる動作を示す場合、その変更は振る舞い互換性がないと言われます。

これらの定義は純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### セーフコールの結果を常に nullable にする

> **課題**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、セーフコールのレシーバが non-nullable であっても、セーフコールの結果の型を常に nullable とみなすようになります。
>
> **非推奨サイクル**:
>
> - &lt;1.3: non-nullable なレシーバに対する不要なセーフコールに対して警告を報告
> - 1.6.20: 不要なセーフコールの結果が次のバージョンで型が変わることを追加で警告
> - 1.7.0: セーフコールの結果の型を nullable に変更。  
> `-XXLanguage:-SafeCallsAreAlwaysNullable` を使用して、一時的に 1.7 以前の動作に戻すことが可能

### 抽象スーパークラスメンバへの super 呼び出しの委譲を禁止する

> **課題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
> 
> **概要**: スーパーインターフェースにデフォルト実装がある場合でも、明示的または暗黙的な super 呼び出しがスーパークラスの _抽象_ メンバに委譲される場合、Kotlin はコンパイルエラーを報告します。
>
> **非推奨サイクル**:
>
> - 1.5.20: すべての抽象メンバをオーバーライドしていない非抽象クラスが使用されている場合に警告を導入
> - 1.7.0: super 呼び出しが実際にスーパークラスの抽象メンバにアクセスしている場合にエラーを報告
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換モードが有効な場合にエラーを報告。プログレッシブモードでエラーを報告
> - &gt;=1.8.0: すべてのケースでエラーを報告

### 非公開のプライマリコンストラクタで宣言された公開プロパティを介した非公開型の公開を禁止する

> **課題**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin は、非公開のプライマリコンストラクタ内で、非公開の型を持つ公開プロパティを宣言することを防止します。別のパッケージからそのようなプロパティにアクセスすると、`IllegalAccessError` が発生する可能性があります。
>
> **非推奨サイクル**:
>
> - 1.3.20: 非公開の型を持ち、非公開のコンストラクタで宣言されている公開プロパティに対して警告を報告
> - 1.6.20: プログレッシブモードでこの警告をエラーに引き上げ
> - 1.7.0: この警告をエラーに引き上げ

### 列挙型名で修飾された未初期化の enum エントリへのアクセスを禁止する

> **課題**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、列挙型の静的初期化ブロックから、列挙型名で修飾された未初期化の enum エントリへのアクセスを禁止します。
>
> **非推奨サイクル**:
>
> - 1.7.0: 列挙型の静的初期化ブロックから未初期化の enum エントリにアクセスした場合にエラーを報告

### when 条件の分岐やループの条件における複雑な Boolean 式の定数計算を禁止する

> **課題**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin は、リテラルの `true` および `false` 以外の定数 Boolean 式に基づいた、網羅性（exhaustiveness）およびコントロールフローの想定を行わなくなります。
>
> **非推奨サイクル**:
>
> - 1.5.30: `when` の網羅性やコントロールフローの到達可能性が、`when` 分岐やループ条件内の複雑な定数 Boolean 式に基づいて決定されている場合に警告を報告
> - 1.7.0: この警告をエラーに引き上げ

### enum、sealed、Boolean を対象とする when ステートメントをデフォルトで網羅的にする

> **課題**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、enum、sealed、または Boolean を対象とする `when` ステートメントが網羅的でない場合にエラーを報告します。
>
> **非推奨サイクル**:
>
> - 1.6.0: enum、sealed、または Boolean を対象とする `when` ステートメントが網羅的でない場合に警告を導入（プログレッシブモードではエラー）
> - 1.7.0: この警告をエラーに引き上げ

### when-with-subject における紛らわしい文法を非推奨にする

> **課題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 は、`when` の条件式におけるいくつかの紛らわしい文法構造を非推奨にしました。
>
> **非推奨サイクル**:
>
> - 1.6.20: 影響を受ける式に対して非推奨の警告を導入
> - 1.8.0: この警告をエラーに引き上げ
> - &gt;= 1.8: 非推奨となった一部の構造を新しい言語機能のために転用

### 型の nullability エンハンスメントの改善

> **課題**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、Java コードにおける型の nullability アノテーションのロードおよび解釈方法が変更されます。
>
> **非推奨サイクル**:
>
> - 1.4.30: より正確な型の nullability がエラーにつながる可能性があるケースについて警告を導入
> - 1.7.0: Java 型のより正確な nullability を推論。  
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` を使用して、一時的に 1.7 以前の動作に戻すことが可能

### 異なる数値型間での暗黙の強制変換を防止する

> **課題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin は、意味的にその型へのダウンキャストのみが必要な場合に、数値をプリミティブ数値型に自動的に変換することを避けるようになります。
>
> **非推奨サイクル**:
>
> - < 1.5.30: 影響を受けるすべてのケースで古い動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャストの動作を修正。  
> `-Xuse-old-backend` を使用して、一時的に 1.5.30 の修正前の動作に戻すことが可能
> - &gt;= 1.7.20: 影響を受ける他のケースにおけるダウンキャストの動作を修正

### コンパイラオプション -Xjvm-default の enable および compatibility モードを非推奨にする

> **課題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6.20 は、`-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードの使用について警告します。
>
> **非推奨サイクル**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` および `compatibility` モードに対して警告を導入
> - &gt;= 1.8.0: この警告をエラーに引き上げ

### 末尾のラムダを持つ suspend という名前の関数呼び出しを禁止する

> **課題**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 は、末尾のラムダとして渡される関数型の単一引数を持つ、`suspend` という名前のユーザー定義関数の呼び出しを許可しなくなりました。
>
> **非推奨サイクル**:
>
> - 1.3.0: このような関数呼び出しに対して警告を導入
> - 1.6.0: この警告をエラーに引き上げ
> - 1.7.0: `{` の前の `suspend` がキーワードとして解析されるように言語文法に変更を導入

### ベースクラスが別のモジュールにある場合、ベースクラスのプロパティに対するスマートキャストを禁止する

> **課題**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、スーパークラスが別のモジュールにある場合、そのクラスのプロパティに対するスマートキャストを許可しなくなります。
>
> **非推奨サイクル**:
>
> - 1.6.0: 別のモジュールにあるスーパークラスで宣言されたプロパティに対するスマートキャストについて警告を報告
> - 1.7.0: この警告をエラーに引き上げ。  
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` を使用して、一時的に 1.7 以前の動作に戻すことが可能

### 型推論中に意味のある制約を無視しないようにする

> **課題**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **コンポーネント**: 言語コア
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.4−1.6 では、誤った最適化により型推論中の一部の型制約が無視されていました。これにより、不適切なコードを記述できてしまい、実行時に `ClassCastException` が発生する可能性がありました。Kotlin 1.7 ではこれらの制約を考慮するため、不適切なコードが禁止されます。
>
> **非推奨サイクル**:
>
> - 1.5.20: すべての型推論制約が考慮された場合に型不一致が発生する式に対して、警告を報告
> - 1.7.0: すべての制約を考慮するようにし、この警告をエラーに引き上げ。  
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` を使用して、一時的に 1.7 以前の動作に戻すことが可能

## 標準ライブラリ（Standard library）

### コレクションの min および max 関数の戻り型を段階的に non-nullable に変更する

> **課題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: コレクションの `min` および `max` 関数の戻り型は、Kotlin 1.7 で non-nullable に変更されます。
>
> **非推奨サイクル**:
>
> - 1.4.0: 同義語として `...OrNull` 関数を導入し、影響を受ける API を非推奨にする（詳細は課題を参照）
> - 1.5.0: 影響を受ける API の非推奨レベルをエラーに引き上げ
> - 1.6.0: 非推奨の関数を公開 API から隠す
> - 1.7.0: 影響を受ける API を non-nullable な戻り型で再導入

### 浮動小数点配列関数 contains、indexOf、lastIndexOf を非推奨にする

> **課題**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin は、全順序（total order）ではなく IEEE-754 順序を使用して値を比較する浮動小数点配列関数 `contains`、`indexOf`、`lastIndexOf` を非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.4.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.6.0: 非推奨レベルをエラーに引き上げ
> - 1.7.0: 非推奨の関数を公開 API から隠す

### kotlin.dom および kotlin.browser パッケージの宣言を kotlinx.* に移行する

> **課題**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: stdlib からの切り出しに備えて、`kotlin.dom` および `kotlin.browser` パッケージの宣言を対応する `kotlinx.*` パッケージに移動します。
>
> **非推奨サイクル**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替 API を導入
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージの API を非推奨にし、上記の新しい API を代替として提案
> - 1.6.0: 非推奨レベルをエラーに引き上げ
> - &gt;= 1.8: 非推奨の関数を stdlib から削除
> - &gt;= 1.8: kotlinx.* パッケージの API を別のライブラリに移動

### 一部の JS 専用 API を非推奨にする

> **課題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: stdlib 内の多数の JS 専用関数が削除のために非推奨になります。これらには以下が含まれます：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（例：`Array<out T>.sort(comparison: (a: T, b: T) -> Int)`）。
>
> **非推奨サイクル**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.8.0: 非推奨レベルをエラーに引き上げ
> - 1.9.0: 非推奨の関数を公開 API から削除

## ツール（Tools）

### KotlinGradleSubplugin クラスを削除する

> **課題**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `KotlinGradleSubplugin` クラスを削除します。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください。
>
> **非推奨サイクル**:
>
> - 1.6.0: 非推奨レベルをエラーに引き上げ
> - 1.7.0: 非推奨のクラスを削除

### useIR コンパイラオプションを削除する

> **課題**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 非推奨で非表示になっていた `useIR` コンパイラオプションを削除します。
>
> **非推奨サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に引き上げ
> - 1.6.0: オプションを非表示にする
> - 1.7.0: 非推奨のオプションを削除

### kapt.use.worker.api Gradle プロパティを非推奨にする

> **課題**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Gradle Workers API を介して kapt を実行できるようにしていた `kapt.use.worker.api` プロパティ（デフォルト: true）を非推奨にします。
>
> **非推奨サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に引き上げ
> - &gt;= 1.8.0: このプロパティを削除

### kotlin.experimental.coroutines Gradle DSL オプションと kotlin.coroutines Gradle プロパティを削除する

> **課題**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `kotlin.experimental.coroutines` Gradle DSL オプションと `kotlin.coroutines` プロパティを削除します。
>
> **非推奨サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に引き上げ
> - 1.7.0: DSL オプション、それを囲む `experimental` ブロック、およびプロパティを削除

### useExperimentalAnnotation コンパイラオプションを非推奨にする

> **課題**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: モジュールで API を使用するためにオプトインするために使用されていた、非表示の `useExperimentalAnnotation()` Gradle 関数を削除します。代わりに `optIn()` 関数を使用できます。
> 
> **非推奨サイクル:**
> 
> - 1.6.0: 非推奨オプションを非表示にする
> - 1.7.0: 非推奨オプションを削除

### kotlin.compiler.execution.strategy システムプロパティを非推奨にする

> **課題**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: コンパイラの実行戦略を選択するために使用されていた `kotlin.compiler.execution.strategy` システムプロパティを非推奨にします。代わりに、Gradle プロパティの `kotlin.compiler.execution.strategy` またはコンパイルタスクプロパティの `compilerExecutionStrategy` を使用してください。
>
> **非推奨サイクル:**
>
> - 1.7.0: 非推奨レベルを警告に引き上げ
> - &gt; 1.7.0: プロパティを削除

### kotlinOptions.jdkHome コンパイラオプションを削除する

> **課題**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: デフォルトの `JAVA_HOME` の代わりに、指定された場所からカスタム JDK をクラスパスに含めるために使用されていた `kotlinOptions.jdkHome` コンパイラオプションを削除します。代わりに [Java ツールチェーン](gradle-configure-project.md#gradle-java-toolchains-support) を使用してください。
>
> **非推奨サイクル:**
>
> - 1.5.30: 非推奨レベルを警告に引き上げ
> - &gt; 1.7.0: オプションを削除

### noStdlib コンパイラオプションを削除する

> **課題**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `noStdlib` コンパイラオプションを削除します。Gradle プラグインは `kotlin.stdlib.default.dependency=true` プロパティを使用して、Kotlin 標準ライブラリの有無を制御します。
>
> **非推奨サイクル:**
>
> - 1.5.0: 非推奨レベルを警告に引き上げ
> - 1.7.0: オプションを削除

### kotlin2js および kotlin-dce-plugin プラグインを削除する

> **課題**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `kotlin2js` および `kotlin-dce-plugin` プラグインを削除します。`kotlin2js` の代わりに、新しい `org.jetbrains.kotlin.js` プラグインを使用してください。デッドコード削除（DCE）は、Kotlin/JS Gradle プラグインが適切に設定されていれば動作します。
>
> **非推奨サイクル:**
>
> - 1.4.0: 非推奨レベルを警告に引き上げ
> - 1.7.0: プラグインを削除

### コンパイルタスクの変更

> **課題**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin コンパイルタスクは Gradle の `AbstractCompile` タスクを継承しなくなったため、Kotlin ユーザーのスクリプトで `sourceCompatibility` および `targetCompatibility` 入力が利用できなくなりました。`SourceTask.stableSources` 入力も利用できなくなりました。`sourceFilesExtensions` 入力は削除されました。非推奨の `Gradle destinationDir: File` 出力は `destinationDirectory: DirectoryProperty` 出力に置き換えられました。`KotlinCompile` タスクの `classpath` プロパティは非推奨です。
>
> **非推奨サイクル:**
>
> - 1.7.0: 入力が利用不可、出力が置き換え、`classpath` プロパティが非推奨
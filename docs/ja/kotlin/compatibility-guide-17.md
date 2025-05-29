[//]: # (title: Kotlin 1.7 互換性ガイド)

_[言語の現代性を保つ](kotlin-evolution-principles.md)_ と _[快適な更新](kotlin-evolution-principles.md)_ は、Kotlin 言語設計における基本原則の1つです。前者は、言語進化を妨げる構成要素は削除されるべきであると述べ、後者は、この削除がコード移行を可能な限りスムーズにするために事前に十分に通知されるべきであると述べています。

言語の変更点のほとんどは、更新変更ログやコンパイラの警告といった他のチャネルを通じて既に発表されていますが、このドキュメントはそれらすべてをまとめ、Kotlin 1.6 から Kotlin 1.7 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

-   ソース非互換性 (source-incompatible) : かつて正常に (エラーや警告なしに) コンパイルできていたコードが、コンパイルできなくなる変更。
-   バイナリ互換性 (binary-compatible) : 2つのバイナリアーティファクトが、それらを入れ替えてもロードエラーやリンケージエラーが発生しない場合、バイナリ互換であるとされます。
-   振る舞い非互換性 (behavioral-incompatible) : 同じプログラムが変更適用前後で異なる振る舞いを示す場合、その変更は振る舞い非互換であるとされます。

これらの定義は、純粋な Kotlin についてのみ与えられていることに注意してください。他の言語の観点からの Kotlin コードの互換性 (例えば、Java からの互換性) は、このドキュメントの範囲外です。

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### セーフコールの結果を常にnull許容にする

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.7 では、セーフコールのレシーバーが非null許容であっても、セーフコールの結果の型が常にnull許容であると見なされるようになります。
>
> **Deprecation cycle**:
>
> -   &lt;1.3: 非null許容レシーバーに対する不要なセーフコールに警告を出す
> -   1.6.20: 不要なセーフコールの結果が次のバージョンで型を変更することについて、追加の警告を出す
> -   1.7.0: セーフコールの結果の型をnull許容に変更する。
> `-XXLanguage:-SafeCallsAreAlwaysNullable` を使用して、一時的に1.7より前の振る舞いに戻すことができます。

### 抽象スーパークラスメンバーへのスーパークラス呼び出しの委譲を禁止する

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin は、明示的または暗黙的なスーパークラス呼び出しが、スーパーインターフェースにデフォルトの実装がある場合でも、スーパークラスの_抽象_メンバーに委譲される場合に、コンパイルエラーを報告するようになります。
>
> **Deprecation cycle**:
>
> -   1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用された場合に警告を導入する
> -   1.7.0: スーパークラス呼び出しが実際にはスーパークラスの抽象メンバーにアクセスする場合にエラーを報告する
> -   1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換性モードが有効になっている場合にエラーを報告する。プログレッシブモードでエラーを報告する。
> -   &gt;=1.8.0: すべてのケースでエラーを報告する

### 非公開プライマリコンストラクタで宣言された公開プロパティを介した非公開型の公開を禁止する

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin は、プライベートプライマリコンストラクタで非公開型を持つ公開プロパティを宣言することを防止するようになります。別のパッケージからそのようなプロパティにアクセスすると `IllegalAccessError` につながる可能性があります。
>
> **Deprecation cycle**:
>
> -   1.3.20: 非公開型を持ち、非公開コンストラクタで宣言された公開プロパティに警告を出す
> -   1.6.20: プログレッシブモードでこの警告をエラーに格上げする
> -   1.7.0: この警告をエラーに格上げする

### 列挙名で修飾された未初期化の列挙エントリへのアクセスを禁止する

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.7 では、列挙型の静的初期化ブロックから、列挙名で修飾された未初期化の列挙エントリへのアクセスが禁止されます。
>
> **Deprecation cycle**:
>
> -   1.7.0: 未初期化の列挙エントリが列挙型の静的初期化ブロックからアクセスされた場合にエラーを報告する

### when条件ブランチおよびループ条件における複雑なboolean式の定数計算を禁止する

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin は、リテラルの `true` と `false` 以外の複雑なboolean式に基づく網羅性や制御フローの仮定を行わなくなります。
>
> **Deprecation cycle**:
>
> -   1.5.30: `when` ブランチまたはループ条件における複雑な定数boolean式に基づいて `when` の網羅性または制御フロー到達可能性が決定される場合に警告を出す
> -   1.7.0: この警告をエラーに格上げする

### enum、sealed、Booleanを対象とするwhen文をデフォルトで網羅的にする

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.7 では、enum、sealed、または Boolean を対象とする `when` 文が網羅的でない場合にエラーが報告されるようになります。
>
> **Deprecation cycle**:
>
> -   1.6.0: enum、sealed、または Boolean を対象とする `when` 文が網羅的でない場合に警告を導入する (プログレッシブモードではエラー)
> -   1.7.0: この警告をエラーに格上げする

### when-with-subjectにおける紛らわしい文法を非推奨にする

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.6 では、`when` 条件式におけるいくつかの紛らわしい文法構成が非推奨になりました。
>
> **Deprecation cycle**:
>
> -   1.6.20: 影響を受ける式に非推奨警告を導入する
> -   1.8.0: この警告をエラーに格上げする
> -   &gt;= 1.8: いくつかの非推奨構成を新しい言語機能のために再利用する

### 型のnull許容性強化の改善

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.7 では、Java コードの型のnull許容性アノテーションをロードおよび解釈する方法が変更されます。
>
> **Deprecation cycle**:
>
> -   1.4.30: より厳密な型のnull許容性がエラーにつながる可能性のあるケースに警告を導入する
> -   1.7.0: Java 型のより厳密なnull許容性を推論する。
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` を使用して、一時的に1.7より前の振る舞いに戻すことができます。

### 異なる数値型間の暗黙的な型強制を防止する

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 振る舞い非互換
>
> **Short summary**: Kotlin は、数値のダウンキャストのみが意味的に必要とされる場合でも、数値が自動的にプリミティブ数値型に変換されるのを避けるようになります。
>
> **Deprecation cycle**:
>
> -   < 1.5.30: 影響を受けるすべてのケースで古い振る舞い
> -   1.5.30: 生成されたプロパティデリゲートアクセサーにおけるダウンキャストの振る舞いを修正する。
> `-Xuse-old-backend` を使用して、一時的に1.5.30より前の修正前の振る舞いに戻すことができます。
> -   &gt;= 1.7.20: 他の影響を受けるケースにおけるダウンキャストの振る舞いを修正する

### コンパイラオプション -Xjvm-default の enable モードと compatibility モードを非推奨にする

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.6.20 では、`-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードの使用について警告が出されます。
>
> **Deprecation cycle**:
>
> -   1.6.20: `-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードに警告を導入する
> -   &gt;= 1.8.0: この警告をエラーに格上げする

### 末尾ラムダを持つ suspend という名前の関数への呼び出しを禁止する

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.6 では、末尾ラムダとして渡される関数型の単一引数を持つ `suspend` という名前のユーザー関数を呼び出すことができなくなります。
>
> **Deprecation cycle**:
>
> -   1.3.0: そのような関数呼び出しに警告を導入する
> -   1.6.0: この警告をエラーに格上げする
> -   1.7.0: `suspend` が `{` の前にキーワードとして解析されるように言語文法を変更する

### 基底クラスが別のモジュールからのものである場合、基底クラスプロパティに対するスマートキャストを禁止する

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.7 では、スーパークラスが別のモジュールに配置されている場合、そのスーパークラスのプロパティに対するスマートキャストが許可されなくなります。
>
> **Deprecation cycle**:
>
> -   1.6.0: 別のモジュールに配置されているスーパークラスで宣言されたプロパティに対するスマートキャストに警告を報告する
> -   1.7.0: この警告をエラーに格上げする。
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` を使用して、一時的に1.7より前の振る舞いに戻すことができます。

### 型推論中に意味のある制約を無視しない

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: コア言語
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin 1.4-1.6 では、誤った最適化のために型推論中に一部の型制約が無視されていました。これにより、不正なコードが記述され、実行時に `ClassCastException` が発生する可能性がありました。Kotlin 1.7 ではこれらの制約が考慮されるようになり、不正なコードが禁止されます。
>
> **Deprecation cycle**:
>
> -   1.5.20: すべての型推論制約が考慮された場合に型不一致が発生する式に警告を報告する
> -   1.7.0: すべての制約を考慮し、この警告をエラーに格上げする。
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` を使用して、一時的に1.7より前の振る舞いに戻すことができます。

## 標準ライブラリ

### コレクションの min および max 関数の戻り型を段階的に非null許容に変更する

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: コレクションの `min` および `max` 関数の戻り型が Kotlin 1.7 で非null許容に変更されます。
>
> **Deprecation cycle**:
>
> -   1.4.0: 同義語として `...OrNull` 関数を導入し、影響を受ける API を非推奨にする (詳細は課題を参照)
> -   1.5.0: 影響を受ける API の非推奨レベルをエラーに格上げする
> -   1.6.0: 非推奨の関数をパブリック API から非表示にする
> -   1.7.0: 影響を受ける API を非null許容の戻り型で再導入する

### 浮動小数点配列関数: contains, indexOf, lastIndexOf を非推奨にする

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin は、IEEE-754 順ではなく全順序を使用して値を比較する浮動小数点配列関数 `contains`、`indexOf`、`lastIndexOf` を非推奨にします。
>
> **Deprecation cycle**:
>
> -   1.4.0: 影響を受ける関数を警告付きで非推奨にする
> -   1.6.0: 非推奨レベルをエラーに格上げする
> -   1.7.0: 非推奨の関数をパブリック API から非表示にする

### kotlin.dom および kotlin.browser パッケージの宣言を kotlinx.* に移行する

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `kotlin.dom` および `kotlin.browser` パッケージの宣言が、stdlib から抽出する準備のために対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> -   1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替 API を導入する
> -   1.4.0: `kotlin.dom` および `kotlin.browser` パッケージの API を非推奨にし、上記の新しい API を代替として提案する
> -   1.6.0: 非推奨レベルをエラーに格上げする
> -   &gt;= 1.8: 非推奨の関数を stdlib から削除する
> -   &gt;= 1.8: `kotlinx.*` パッケージの API を別のライブラリに移動する

### 一部のJS専用APIを非推奨にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: stdlib のいくつかの JS 専用関数が削除のために非推奨になりました。これには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数 (例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`) が含まれます。
>
> **Deprecation cycle**:
>
> -   1.6.0: 影響を受ける関数を警告付きで非推奨にする
> -   1.8.0: 非推奨レベルをエラーに格上げする
> -   1.9.0: 非推奨の関数をパブリック API から削除する

## ツール

### KotlinGradleSubplugin クラスを削除する

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `KotlinGradleSubplugin` クラスを削除します。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください。
>
> **Deprecation cycle**:
>
> -   1.6.0: 非推奨レベルをエラーに格上げする
> -   1.7.0: 非推奨のクラスを削除する

### useIR コンパイラオプションを削除する

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: 非推奨で非表示の `useIR` コンパイラオプションを削除します。
>
> **Deprecation cycle**:
>
> -   1.5.0: 非推奨レベルを警告に格上げする
> -   1.6.0: オプションを非表示にする
> -   1.7.0: 非推奨のオプションを削除する

### kapt.use.worker.api Gradle プロパティを非推奨にする

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Gradle Workers API 経由で kapt を実行することを許可していた `kapt.use.worker.api` プロパティ (デフォルト: true) を非推奨にします。
>
> **Deprecation cycle**:
>
> -   1.6.20: 非推奨レベルを警告に格上げする
> -   &gt;= 1.8.0: このプロパティを削除する

### kotlin.experimental.coroutines Gradle DSL オプションと kotlin.coroutines Gradle プロパティを削除する

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSL オプションと `kotlin.coroutines` プロパティを削除します。
>
> **Deprecation cycle**:
>
> -   1.6.20: 非推奨レベルを警告に格上げする
> -   1.7.0: DSL オプション、それを囲む `experimental` ブロック、およびプロパティを削除する

### useExperimentalAnnotation コンパイラオプションを非推奨にする

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: モジュールで API を使用するためにオプトインする際に使用されていた非表示の `useExperimentalAnnotation()` Gradle 関数を削除します。代わりに `optIn()` 関数を使用できます。
>
> **Deprecation cycle:**
>
> -   1.6.0: 非推奨オプションを非表示にする
> -   1.7.0: 非推奨オプションを削除する

### kotlin.compiler.execution.strategy システムプロパティを非推奨にする

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: コンパイラの実行戦略を選択するために使用されていた `kotlin.compiler.execution.strategy` システムプロパティを非推奨にします。代わりに Gradle プロパティ `kotlin.compiler.execution.strategy` またはコンパイルタスクプロパティ `compilerExecutionStrategy` を使用してください。
>
> **Deprecation cycle:**
>
> -   1.7.0: 非推奨レベルを警告に格上げする
> -   &gt; 1.7.0: プロパティを削除する

### kotlinOptions.jdkHome コンパイラオプションを削除する

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: デフォルトの `JAVA_HOME` の代わりに、指定された場所からカスタム JDK をクラスパスに含めるために使用されていた `kotlinOptions.jdkHome` コンパイラオプションを削除します。代わりに [Java toolchains](gradle-configure-project.md#gradle-java-toolchains-support) を使用してください。
>
> **Deprecation cycle:**
>
> -   1.5.30: 非推奨レベルを警告に格上げする
> -   &gt; 1.7.0: オプションを削除する

### noStdlib コンパイラオプションを削除する

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `noStdlib` コンパイラオプションを削除します。Gradle プラグインは `kotlin.stdlib.default.dependency=true` プロパティを使用して、Kotlin 標準ライブラリが存在するかどうかを制御します。
>
> **Deprecation cycle:**
>
> -   1.5.0: 非推奨レベルを警告に格上げする
> -   1.7.0: オプションを削除する

### kotlin2js および kotlin-dce-plugin プラグインを削除する

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: `kotlin2js` および `kotlin-dce-plugin` プラグインを削除します。`kotlin2js` の代わりに、新しい `org.jetbrains.kotlin.js` プラグインを使用してください。デッドコード除去 (DCE) は、Kotlin/JS Gradle プラグインが [適切に構成されている](http://javascript-dce.md) 場合に機能します。
>
> **Deprecation cycle:**
>
> -   1.4.0: 非推奨レベルを警告に格上げする
> -   1.7.0: プラグインを削除する

### コンパイルタスクの変更

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: ソース非互換
>
> **Short summary**: Kotlin のコンパイルタスクはもはや Gradle の `AbstractCompile` タスクを継承しないため、`sourceCompatibility` および `targetCompatibility` の入力は Kotlin ユーザーのスクリプトで利用できなくなります。`SourceTask.stableSources` 入力は利用できなくなりました。`sourceFilesExtensions` 入力は削除されました。非推奨の `Gradle destinationDir: File` 出力は `destinationDirectory: DirectoryProperty` 出力に置き換えられました。`KotlinCompile` タスクの `classpath` プロパティは非推奨です。
>
> **Deprecation cycle:**
>
> -   1.7.0: 入力は利用できなくなり、出力は置き換えられ、`classpath` プロパティは非推奨になりました。
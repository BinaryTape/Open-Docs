[//]: # (title: Kotlin 1.6.x 互換性ガイド)

「[言語をモダンに保つ](kotlin-evolution-principles.md)」および「[快適なアップデート](kotlin-evolution-principles.md)」は、Kotlin 言語設計における基本原則です。前者は言語の進化を妨げる構成要素は削除されるべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、その削除について事前に十分に周知されるべきであることを示しています。

ほとんどの言語変更は、アップデートの変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめ、Kotlin 1.5 から Kotlin 1.6 への移行のための完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、数種類の互換性について紹介します。

- **ソース（source）**: ソース互換性のない変更は、以前は正常にコンパイルできていた（エラーや警告が出ていなかった）コードがコンパイルできなくなることを指します。
- **バイナリ（binary）**: 2 つのバイナリアーティファクトを入れ替えてもロードエラーやリンケージエラーが発生しない場合、それらはバイナリ互換であると言います。
- **振る舞い（behavioral）**: 変更を適用する前後で、同じプログラムが異なる動作を示す場合、その変更は振る舞い互換性がないと言います。

これらの定義は純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語（Language）

### enum、sealed、Boolean を対象とする when 式をデフォルトで網羅的にする

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`enum`、`sealed`、または `Boolean` を対象とする `when` 式が網羅的（exhaustive）でない場合に警告が表示されます。
>
> **非推奨化サイクル**:
>
> - 1.6.0: `enum`、`sealed`、または `Boolean` を対象とする `when` 式が網羅的でない場合に警告を導入（プログレッシブモードではエラー）
> - 1.7.0: この警告をエラーに格上げ

### when の条件式における紛らわしい文法の非推奨化

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`when` の条件式におけるいくつかの紛らわしい文法構成を非推奨にします。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 該当する式に対して非推奨の警告を導入
> - 1.8.0: この警告をエラーに格上げ
> - >= 1.8: 非推奨となった一部の構成を、新しい言語機能のために再利用

### コンパニオンオブジェクトおよびネストされたオブジェクトの super コンストラクタ呼び出しにおけるクラスメンバへのアクセス禁止

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、コンパニオンオブジェクトや通常のオブジェクトの `super` コンストラクタ呼び出しの引数において、その引数のレシーバが包含する宣言を参照している場合にエラーを報告します。
>
> **非推奨化サイクル**:
>
> - 1.5.20: 問題のある引数に対して警告を導入
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitSelfCallsInNestedObjects` を使用して、一時的に 1.6 以前の動作に戻すことが可能

### 型の Null 許容性の強化に関する改善

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.7 では、Java コードにおける型の Null 許容性（nullability）アノテーションのロードおよび解釈方法が変更されます。
>
> **非推奨化サイクル**:
>
> - 1.4.30: より正確な型の Null 許容性がエラーにつながる可能性があるケースに対して警告を導入
> - 1.7.0: Java 型のより正確な Null 許容性を推論。`-XXLanguage:-TypeEnhancementImprovementsInStrictMode` を使用して、一時的に 1.7 以前の動作に戻すことが可能

### 異なる数値型間での暗黙的な型変換の防止

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin は、意味的にその型へのダウンキャスト（downcast）のみが必要な場合に、数値をプリミティブな数値型へ自動的に変換することを避けるようになります。
>
> **非推奨化サイクル**:
>
> - < 1.5.30: 影響を受けるすべてのケースにおける以前の動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャスト動作を修正。`-Xuse-old-backend` を使用して、一時的に 1.5.30 の修正前の動作に戻すことが可能
> - >= 1.6.20: 他の影響を受けるケースにおけるダウンキャスト動作を修正

### JLS に違反するコンテナアノテーションを持つ繰り返し可能なアノテーションクラスの宣言禁止

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、繰り返し可能な（repeatable）アノテーションのコンテナアノテーションが [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) と同じ要件（配列型の `value` メソッド、保持期間（retention）、およびターゲット）を満たしているかチェックします。
>
> **非推奨化サイクル**:
>
> - 1.5.30: JLS 要件に違反する繰り返し可能なコンテナアノテーションの宣言に対して警告を導入（プログレッシブモードではエラー）
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-RepeatableAnnotationContainerConstraints` を使用して、一時的にエラー報告を無効化することが可能

### 繰り返し可能なアノテーションクラス内での Container という名前のネストされたクラスの宣言禁止

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、Kotlin で宣言された繰り返し可能なアノテーションが、事前定義された名前である `Container` というネストされたクラスを持っていないかチェックします。
>
> **非推奨化サイクル**:
>
> - 1.5.30: Kotlin の繰り返し可能なアノテーションクラス内の `Container` という名前のネストされたクラスに対して警告を導入（プログレッシブモードではエラー）
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-RepeatableAnnotationContainerConstraints` を使用して、一時的にエラー報告を無効化することが可能

### インターフェースのプロパティをオーバーライドするプライマリコンストラクタのプロパティに対する @JvmField の禁止

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、インターフェースのプロパティをオーバーライドし、かつプライマリコンストラクタで宣言されたプロパティを `@JvmField` アノテーションで修飾することを禁止します。
>
> **非推奨化サイクル**:
>
> - 1.5.20: プライマリコンストラクタ内のそのようなプロパティに対する `@JvmField` アノテーションに警告を導入
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` を使用して、一時的にエラー報告を無効化することが可能

### コンパイラオプション -Xjvm-default の enable モードおよび compatibility モードの非推奨化

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **コンポーネント**: Kotlin/JVM
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6.20 では、`-Xjvm-default` コンパイラオプションの `enable` モードおよび `compatibility` モードの使用について警告します。
>
> **非推奨化サイクル**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` モードおよび `compatibility` モードに対して警告を導入
> - >= 1.8.0: この警告をエラーに格上げ

### 公開 ABI インライン関数からの super 呼び出しの禁止

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`public` または `protected` なインライン関数およびプロパティから、`super` 修飾子を伴う関数呼び出しを禁止します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 公開または保護されたインライン関数あるいはプロパティアクセサからの `super` 呼び出しに対して警告を導入
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitSuperCallsFromPublicInline` を使用して、一時的にエラー報告を無効化することが可能

### 公開インライン関数からの protected コンストラクタ呼び出しの禁止

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`public` または `protected` なインライン関数およびプロパティから、`protected` コンストラクタを呼び出すことを禁止します。
>
> **非推奨化サイクル**:
>
> - 1.4.30: 公開または保護されたインライン関数あるいはプロパティアクセサからの保護されたコンストラクタ呼び出しに対して警告を導入
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` を使用して、一時的にエラー報告を無効化することが可能

### private-in-file 型からの非公開なネストされた型の公開禁止

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、`private-in-file` 型から、非公開（private）なネストされた型やインナークラスを公開することを禁止します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: `private-in-file` 型から公開されている非公開型に対して警告を導入
> - 1.6.0: この警告をエラーに格上げ。`-XXLanguage:-PrivateInFileEffectiveVisibility` を使用して、一時的にエラー報告を無効化することが可能

### 型に対するアノテーションにおいてアノテーションターゲットが解析されないケースの修正

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、型に対して適用されるべきでないアノテーションを、型に対して使用することを許可しなくなります。
>
> **非推奨化サイクル**:
>
> - 1.5.20: プログレッシブモードでエラーを導入
> - 1.6.0: エラーを導入。`-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` を使用して、一時的にエラー報告を無効化することが可能

### 末尾のラムダを伴う suspend という名前の関数の呼び出し禁止

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **コンポーネント**: コア言語
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin 1.6 では、関数型の単一の引数が末尾のラムダとして渡される、`suspend` という名前の関数の呼び出しを許可しなくなります。
>
> **非推奨化サイクル**:
>
> - 1.3.0: そのような関数呼び出しに対して警告を導入
> - 1.6.0: この警告をエラーに格上げ
> - >= 1.7.0: 言語文法に変更を導入し、`{` の前の `suspend` がキーワードとして解析されるように変更

## 標準ライブラリ（Standard library）

### minus/removeAll/retainAll における不安定な contains 最適化の削除

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin 1.6 では、コレクション、イテラブル、配列、シーケンスから複数の要素を削除する関数や演算子の引数に対して、`Set` への変換を行わなくなります。
>
> **非推奨化サイクル**:
>
> - < 1.6: 以前の動作：一部のケースで引数が `Set` に変換される
> - 1.6.0: 関数の引数がコレクションの場合、`Set` には変換されなくなります。コレクションでない場合は、代わりに `List` に変換される可能性があります。JVM では、システムプロパティ `kotlin.collections.convert_arg_to_set_in_removeAll=true` を設定することで、以前の動作を一時的にオンにすることができます。
> - >= 1.7: 上記のシステムプロパティは効果がなくなります。

### Random.nextLong における値生成アルゴリズムの変更

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin 1.6 では、指定された範囲外の値を生成することを避けるため、`Random.nextLong` 関数の値生成アルゴリズムを変更します。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 直ちに動作を修正

### コレクションの min および max 関数の戻り値の型を非 null に段階的に変更

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: コレクションの `min` および `max` 関数の戻り値の型は、Kotlin 1.7 で非 null（non-nullable）に変更されます。
>
> **非推奨化サイクル**:
>
> - 1.4.0: 同義語として `...OrNull` 関数を導入し、影響を受ける API を非推奨化（詳細は Issue を参照）
> - 1.5.0: 影響を受ける API の非推奨レベルをエラーに格上げ
> - 1.6.0: 非推奨の関数を公開 API から隠蔽
> - >= 1.7: 影響を受ける API を、非 null の戻り値の型で再導入

### 浮動小数点配列関数 contains、indexOf、lastIndexOf の非推奨化

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **コンポーネント**: kotlin-stdlib
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Kotlin は、総順序（total order）ではなく IEEE-754 順序を使用して値を比較する浮動小数点配列関数 `contains`、`indexOf`、`lastIndexOf` を非推奨にします。
>
> **非推奨化サイクル**:
>
> - 1.4.0: 該当する関数を警告付きで非推奨化
> - 1.6.0: 非推奨レベルをエラーに格上げ
> - >= 1.7: 非推奨の関数を公開 API から隠蔽

### kotlin.dom および kotlin.browser パッケージからの宣言を kotlinx.* へ移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: stdlib からの切り離しに備えて、`kotlin.dom` および `kotlin.browser` パッケージの宣言を対応する `kotlinx.*` パッケージに移動します。
>
> **非推奨化サイクル**:
>
> - 1.4.0: `kotlinx.dom` および `kotlinx.browser` パッケージに代替 API を導入
> - 1.4.0: `kotlin.dom` および `kotlin.browser` パッケージの API を非推奨化し、上記の新しい API を代替として提案
> - 1.6.0: 非推奨レベルをエラーに格上げ
> - >= 1.7: 非推奨の関数を stdlib から削除
> - >= 1.7: kotlinx.* パッケージの API を別個のライブラリに移動

### Kotlin/JS において Regex.replace 関数を非インライン化

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 関数型の `transform` パラメータを持つ `Regex.replace` 関数は、Kotlin/JS においてインライン（inline）ではなくなります。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 該当する関数から `inline` 修飾子を削除

### 置換文字列にグループ参照が含まれる場合の JVM と JS での Regex.replace 関数の動作の違い

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin/JS の `Regex.replace` 関数において、置換パターン文字列を使用する場合のパターンの構文を Kotlin/JVM と同じものに従うようにします。
>
> **非推奨化サイクル**:
>
> - 1.6.0: Kotlin/JS stdlib の `Regex.replace` における置換パターンの処理を変更

### JS の Regex における Unicode ケースフォールディングの使用

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: 振る舞い
>
> **概要**: Kotlin/JS の `Regex` クラスは、基礎となる JS 正規表現エンジンを呼び出す際に [`unicode`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) フラグを使用し、Unicode ルールに従って文字の検索および比較を行うようになります。
> これにより、JS 環境に特定のバージョン要件が生じ、正規表現パターン文字列内での不要なエスケープに対してより厳格な検証が行われるようになります。
>
> **非推奨化サイクル**:
>
> - 1.5.0: JS の `Regex` クラスのほとんどの関数で Unicode ケースフォールディングを有効化
> - 1.6.0: `Regex.replaceFirst` 関数で Unicode ケースフォールディングを有効化

### 一部の JS 専用 API の非推奨化

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース
>
> **概要**: stdlib 内の多数の JS 専用関数を削除のために非推奨にします。これには `String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（例：`Array<out T>.sort(comparison: (a: T, b: T) -> Int)`）が含まれます。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 該当する関数を警告付きで非推奨化
> - 1.7.0: 非推奨レベルをエラーに格上げ
> - 1.8.0: 非推奨の関数を公開 API から削除

### Kotlin/JS のクラスの公開 API から実装および相互運用固有の関数を隠蔽

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **互換性のない変更の種類**: ソース、バイナリ
>
> **概要**: 関数 `HashMap.createEntrySet` および `AbstactMutableCollection.toJSON` の可視性を `internal` に変更します。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 関数を `internal` にし、公開 API から削除

## ツール（Tools）

### KotlinGradleSubplugin クラスの非推奨化

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `KotlinGradleSubplugin` クラスは、`KotlinCompilerPluginSupportPlugin` に代わって非推奨になります。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 非推奨レベルをエラーに格上げ
> - >= 1.7.0: 非推奨のクラスを削除

### kotlin.useFallbackCompilerSearch ビルドオプションの削除

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 非推奨となっていた 'kotlin.useFallbackCompilerSearch' ビルドオプションを削除します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に格上げ
> - 1.6.0: 非推奨のオプションを削除

### いくつかのコンパイラオプションの削除

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 非推奨となっていた `noReflect` および `includeRuntime` コンパイラオプションを削除します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 非推奨レベルをエラーに格上げ
> - 1.6.0: 非推奨のオプションを削除

### useIR コンパイラオプションの非推奨化

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: 非推奨となった `useIR` コンパイラオプションを隠蔽します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に格上げ
> - 1.6.0: オプションを隠蔽
> - >= 1.7.0: 非推奨のオプションを削除

### kapt.use.worker.api Gradle プロパティの非推奨化

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: Gradle Workers API 経由で kapt を実行することを可能にしていた `kapt.use.worker.api` プロパティを非推奨にします（デフォルトは true）。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に格上げ
> - >= 1.8.0: このプロパティを削除

### kotlin.parallel.tasks.in.project Gradle プロパティの削除

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `kotlin.parallel.tasks.in.project` プロパティを削除します。
>
> **非推奨化サイクル**:
>
> - 1.5.20: 非推奨レベルを警告に格上げ
> - 1.6.20: このプロパティを削除

### kotlin.experimental.coroutines Gradle DSL オプションおよび kotlin.coroutines Gradle プロパティの非推奨化

> **Issue**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **コンポーネント**: Gradle
>
> **互換性のない変更の種類**: ソース
>
> **概要**: `kotlin.experimental.coroutines` Gradle DSL オプションおよび `kotlin.coroutines` プロパティを非推奨にします。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に格上げ
> - >= 1.7.0: DSL オプションおよびプロパティを削除
---
title: "Kotlin 2.0 の互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ および _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本原則の1つです。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行を可能な限りスムーズにするために、この削除は事前に十分に周知されるべきであるとしています。

言語の変更点のほとんどは、更新された変更履歴やコンパイラーの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントでは、Kotlin 1.9からKotlin 2.0への移行に関する完全なリファレンスを提供します。

:::note
Kotlin K2コンパイラーはKotlin 2.0の一部として導入されました。新しいコンパイラーの利点、移行中に発生する可能性のある変更、および以前のコンパイラーへのロールバック方法については、[K2 compiler migration guide](k2-compiler-migration-guide)を参照してください。

:::

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース互換性）：ソース非互換の変更により、正常にコンパイルできていた（エラーや警告なしに）コードがコンパイルできなくなります。
- _binary_（バイナリ互換性）：2つのバイナリアーティファクトを相互に交換しても、ロードエラーやリンケージエラーが発生しない場合、それらはバイナリ互換性があると言えます。
- _behavioral_（動作互換性）：変更を適用する前と後で、同じプログラムが異なる動作を示す場合、その変更は動作非互換であると言えます。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。他の言語の視点（たとえば、Javaから見た場合）からのKotlinコードの互換性は、このドキュメントの範囲外です。

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

### 射影されたレシーバー上の合成セッターの使用を非推奨にする

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Javaクラスの合成セッターを使用して、そのクラスの射影された型と競合する型を割り当てると、エラーがトリガーされます。
>
> **Deprecation cycle**:
>
> - 1.8.20: 合成プロパティセッターが反変の位置に射影されたパラメーター型を持ち、呼び出しサイトの引数型が互換性がない場合に警告を報告します。
> - 2.0.0: 警告をエラーに格上げします。

### Javaサブクラスでオーバーロードされたインラインクラスパラメーターを持つ関数を呼び出す際の正しいマングリング

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 関数呼び出しで正しいマングリング動作を使用します。以前の動作に戻すには、`-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` コンパイラーオプションを使用します。

### 反変キャプチャ型に対する正しい型近似アルゴリズム

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 問題のある呼び出しで警告を報告します。
> - 2.0.0: 警告をエラーに格上げします。

### プロパティの初期化前にプロパティ値へのアクセスを禁止する

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 影響を受けるコンテキストで、初期化前にプロパティにアクセスするとエラーを報告します。

### 同じ名前でインポートされたクラスがあいまいな場合にエラーを報告する

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: スターインポートでインポートされた複数のパッケージに存在するクラス名を解決する際にエラーを報告します。

### デフォルトで invokedynamic および LambdaMetafactory を介して Kotlin ラムダを生成する

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。ラムダはデフォルトで `invokedynamic` および `LambdaMetafactory` を使用して生成されます。

### 式が必要な場合に、1つのブランチを持つ if 条件を禁止する

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: `if` 条件にブランチが1つしかない場合にエラーを報告します。

### ジェネリック型のスタープロジェクションを渡すことによる自己上限の違反を禁止する

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリック型のスタープロジェクションを渡すことによって自己上限が違反された場合にエラーを報告します。

### プライベートインライン関数の戻り値の型で匿名型を近似する

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 推論された戻り値の型に匿名型が含まれている場合、プライベートインライン関数で警告を報告します。
> - 2.0.0: このようなプライベートインライン関数の戻り値の型をスーパータイプに近似します。

### ローカル関数型プロパティのinvoke規約よりもローカル拡張関数呼び出しを優先するようにオーバーロード解決の動作を変更する

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しいオーバーロード解決の動作。関数呼び出しは、invoke規約よりも一貫して優先されます。

### バイナリ依存関係からのスーパークラスの変更により、継承されたメンバーの競合が発生した場合にエラーを報告する

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: バイナリ依存関係からのスーパークラスで継承されたメンバーの競合が発生した場合、宣言で CONFLICTING_INHERITED_MEMBERS_WARNING 警告を報告します。
> - 2.0.0: 警告をエラーに格上げします。CONFLICTING_INHERITED_MEMBERS

### 不変型におけるパラメータの @UnsafeVariance アノテーションを無視する

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。`@UnsafeVariance` アノテーションは、反変パラメータの型の不一致に関するエラーを報告する際に無視されます。

### コンパニオンオブジェクトのメンバーへのコール外部参照の型を変更する

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: アンバウンド参照として推論されるコンパニオンオブジェクト関数参照型で警告を報告します。
> - 2.0.0: コンパニオンオブジェクト関数参照がすべての使用コンテキストでバウンド参照として推論されるように動作を変更します。

### プライベートインライン関数からの匿名型の公開を禁止する

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: プライベートインライン関数から返された匿名オブジェクトの独自のメンバーへの呼び出しで警告を報告します。
> - 2.0.0: このようなプライベートインライン関数の戻り値の型をスーパータイプに近似し、匿名オブジェクトメンバーへの呼び出しを解決しません。

### whileループのbreak後の不正なスマートキャストのエラーを報告する

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。古い動作は、言語バージョン1.9に切り替えることで復元できます。

### インターセクション型の変数に、そのインターセクション型のサブタイプではない値が割り当てられた場合にエラーを報告する

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: インターセクション型を持つ変数に、そのインターセクション型のサブタイプではない値が割り当てられた場合にエラーを報告します。

### SAMコンストラクターで構築されたインターフェースに、オプトインが必要なメソッドが含まれている場合にオプトインを要求する

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: SAMコンストラクターを介した `OptIn` の使用法で警告を報告します。
> - 2.0.0: SAMコンストラクターを介した `OptIn` の使用法で警告をエラーに格上げします（または、`OptIn` マーカーの重大度が警告の場合は警告を報告し続けます）。

### 型エイリアスコンストラクターにおける上限の違反を禁止する

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 型エイリアスコンストラクターで上限が違反された場合に警告を導入します。
> - 2.0.0: K2コンパイラーで警告をエラーに格上げします。

### 分解変数の実際の型を、指定された明示的な型と一致させる

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。分解変数の実際の型は、指定された場合に明示的な型と一致するようになりました。

### オプトインが必要なデフォルト値を持つパラメーター型を持つコンストラクターを呼び出すときにオプトインを要求する

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: オプトインが必要なパラメーター型を持つコンストラクター呼び出しで警告を報告します。
> - 2.0.0: 警告をエラーに格上げします（または、`OptIn` マーカーの重大度が警告の場合は警告を報告し続けます）。

### 同じスコープレベルで同じ名前のプロパティとenumエントリ間のあいまいさを報告する

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: コンパイラーが同じスコープレベルでenumエントリの代わりにプロパティに解決される場合に警告を報告します。
> - 2.0.0: コンパイラーが同じスコープレベルで同じ名前のプロパティとenumエントリの両方を検出した場合、K2コンパイラーであいまいさを報告します（古いコンパイラーでは警告をそのままにします）。

### コンパニオンプロパティをenumエントリよりも優先するように修飾子の解決動作を変更する

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい解決動作を実装します。コンパニオンプロパティはenumエントリよりも優先されます。

### 非糖衣構文で記述された場合と同様に、invoke呼び出しのレシーバー型とinvoke関数型を解決する

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: invoke呼び出しのレシーバー型とinvoke関数型を、非糖衣構文で記述された場合と同様に個別に解決します。

### プライベートクラスメンバーを非プライベートインライン関数を介して公開することを禁止する

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 内部インライン関数からプライベートクラスコンパニオンオブジェクトメンバーを呼び出すと、`PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告を報告します。
> - 2.0.0: この警告を `PRIVATE_CLASS_MEMBER_FROM_INLINE` エラーに格上げします。

### 射影されたジェネリック型における非null型のnull可能性を修正する

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。射影された型は、すべてのインプレース非null型を考慮します。

### 接頭辞インクリメントの推論型を、inc()オペレーターの戻り値の型ではなく、ゲッターの戻り値の型に一致するように変更する

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。接頭辞インクリメントの推論型は、`inc()` オペレーターの戻り値の型ではなく、ゲッターの戻り値の型に一致するように変更されます。

### スーパークラスで宣言されたジェネリック内部クラスから内部クラスを継承する場合、境界チェックを強制する

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: ジェネリック内部スーパークラスの型パラメーターの上限が違反された場合にエラーを報告します。

### 予想される型が関数型のパラメーターを持つ関数型である場合に、SAM型を持つ呼び出し可能な参照の割り当てを禁止する

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 予想される型が関数型のパラメーターを持つ関数型である場合に、SAM型を持つ呼び出し可能な参照でコンパイルエラーを報告します。

### コンパニオンオブジェクトのアノテーション解決のためにコンパニオンオブジェクトスコープを考慮する

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。コンパニオンオブジェクトのアノテーション解決中にコンパニオンオブジェクトスコープが無視されなくなりました。

### セーフコールと規約演算子の組み合わせに対する評価セマンティクスを変更する

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: 各不正な呼び出しで警告を報告します。
> - 2.0.0: 新しい解決動作を実装します。

### バッキングフィールドとカスタムセッターを持つプロパティがすぐに初期化されるように要求する

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: プライマリコンストラクターがない場合に `MUST_BE_INITIALIZED` 警告を導入します。
> - 2.0.0: 警告をエラーに格上げします。

### invokeオペレーター規約呼び出しで任意の式に対するUnit変換を禁止する

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: Unit変換が変数およびinvoke解決の任意の式に適用された場合にエラーを報告します。影響を受ける式で以前の動作を維持するには、`-XXLanguage:+UnitConversionsOnArbitraryExpressions` コンパイラーオプションを使用します。

### フィールドがセーフコールでアクセスされた場合、null許容値を非null Javaフィールドに割り当てることを禁止する

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: null許容値が非null Javaフィールドに割り当てられた場合にエラーを報告します。

### 生の型パラメーターを含むJavaメソッドをオーバーライドするときに、スター射影型を要求する

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。生の型パラメーターに対するオーバーライドは禁止されています。

### Vにコンパニオンがある場合の(V)::foo参照解決を変更する

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: 現在コンパニオンオブジェクトインスタンスにバインドされている呼び出し可能な参照で警告を報告します。
> - 2.0.0: 新しい動作を実装します。型の周りに括弧を追加しても、型のコンパニオンオブジェクトインスタンスへの参照にはなりません。

### 事実上パブリックなインライン関数での暗黙的な非パブリックAPIアクセスを禁止する

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: パブリックインライン関数で暗黙的な非パブリックAPIにアクセスすると、コンパイル警告を報告します。
> - 2.0.0: 警告をエラーに格上げします。

### プロパティゲッターでのuse-site getアノテーションを禁止する

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: ゲッターでのuse-site `get` アノテーションで警告を報告します（プログレッシブモードではエラー）。
> - 2.0.0: 警告を `INAPPLICABLE_TARGET_ON_PROPERTY` エラーに格上げします。`-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` を使用して警告に戻します。

### ビルダー推論ラムダ関数で型パラメーターが上限に暗黙的に推論されるのを防ぐ

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 型引数の型パラメーターが宣言された上限に推論できない場合に警告（またはプログレッシブモードではエラー）を報告します。
> - 2.0.0: 警告をエラーに格上げします。

### パブリックシグネチャでローカル型を近似するときにnull可能性を維持する

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: フレキシブル型はフレキシブルスーパータイプによって近似されます。宣言がnull許容である必要がある非null型を持つように推論された場合に、NPEを回避するために型を明示的に指定するように促す警告を報告します。
> - 2.0.0: null許容型はnull許容スーパータイプによって近似されます。

### スマートキャストの目的で false && ... および false || ... に対する特別な処理を削除する

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 新しい動作を実装します。`false && ...` および `false || ...` に対する特別な処理はありません。

### enumでのインラインオープン関数を禁止する

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: enumでのインラインオープン関数で警告を報告します。
> - 2.0.0: 警告をエラーに格上げします。

## ツール

### Gradleでの可視性の変更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以前は、特定のDSLコンテキストを対象とした特定のKotlin DSL関数およびプロパティが、誤って他のDSLコンテキストにリークしていました。`@KotlinGradlePluginDsl` アノテーションを追加しました。これにより、Kotlin GradleプラグインDSL関数およびプロパティが、意図されていないレベルに公開されるのを防ぎます。次のレベルは互いに分離されています。
> * Kotlin 拡張機能
> * Kotlin ターゲット
> * Kotlin コンパイル
> * Kotlin コンパイルタスク
>
> **Deprecation cycle**:
>
> - 2.0.0: ほとんどの場合、ビルドスクリプトが正しく構成されていない場合、コンパイラーは修正方法に関する提案を含む警告を報告します。それ以外の場合、コンパイラーはエラーを報告します。

### kotlinOptions DSLを非推奨にする

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlinOptions` DSLおよび関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介してコンパイラーオプションを構成する機能は非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告します。

### KotlinCompilation DSLのcompilerOptionsを非推奨にする

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilation` DSLの`compilerOptions` プロパティを構成する機能は非推奨になりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: 警告を報告します。

### CInteropProcessの古い処理方法を非推奨にする

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` タスクおよび `CInteropSettings` クラスは、`defFile` および `defFileProperty` の代わりに `definitionFile` プロパティを使用するようになりました。
> 
> これにより、`defFile` が動的に生成される場合に、`CInteropProcess` タスクと `defFile` を生成するタスクの間に余分な `dependsOn` 関係を追加する必要がなくなります。
> 
> Kotlin/Nativeプロジェクトでは、Gradleはビルドプロセスの後半で接続されたタスクが実行された後、`definitionFile` プロパティの存在を遅延して検証するようになりました。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` および `defFileProperty` パラメーターは非推奨になりました。

### kotlin.useK2 Gradleプロパティを削除する

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradleプロパティは削除されました。Kotlin 1.9.*では、K2コンパイラーを有効にするために使用できました。Kotlin 2.0.0以降では、K2コンパイラーはデフォルトで有効になっているため、プロパティは効果がなくなり、以前のコンパイラーに切り替えるために使用できません。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradleプロパティは非推奨になりました。
> - 2.0.0: `kotlin.useK2` Gradleプロパティは削除されました。

### 非推奨のプラットフォームプラグインIDを削除する

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: これらのプラットフォームプラグインIDのサポートは削除されました。
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: プラットフォームプラグインIDは非推奨です。
> - 2.0.0: プラットフォームプラグインIDはサポートされなくなりました。

### outputFile JavaScriptコンパイラーオプションを削除する

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScriptコンパイラーオプションは削除されました。代わりに、コンパイルされたJavaScript出力ファイルが書き込まれるディレクトリーを指定するには、`Kotlin2JsCompile` タスクの `destinationDirectory` プロパティを使用できます。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` コンパイラーオプションは非推奨です。
> - 2.0.0: `outputFile` コンパイラーオプションは削除されました。
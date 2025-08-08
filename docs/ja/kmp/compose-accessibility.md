[//]: # (title: アクセシビリティ)

Compose Multiplatformは、セマンティックプロパティ、アクセシビリティAPI、スクリーンリーダーやキーボードナビゲーションを含む支援技術のサポートなど、アクセシビリティ標準を満たすために不可欠な機能を提供します。

このフレームワークにより、[欧州アクセシビリティ法](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) および [ウェブコンテンツアクセシビリティガイドライン](https://www.w3.org/TR/WCAG21/) (WCAG) の要件に準拠するアプリケーションを設計できます。

## セマンティックプロパティ

アクセシビリティ、オートフィル、テストなどのサービスにコンテキストを提供するために、セマンティックプロパティを使用してコンポーネントの意味と役割を定義できます。

セマンティックプロパティは、UIの簡略化された表現であるセマンティックツリーの構成要素です。コンポーザブルでセマンティックプロパティを定義すると、それらは自動的にセマンティックツリーに追加されます。支援技術は、UIツリー全体ではなく、セマンティックツリーをトラバースすることによってアプリと対話します。

アクセシビリティの主要なセマンティックプロパティ:

*   `contentDescription` は、[`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) や [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html) のような非テキストまたは曖昧なUI要素に説明を提供します。これは主要なアクセシビリティAPIであり、スクリーンリーダーが読み上げるテキストラベルを提供するために使用されます。

    ```kotlin
    Modifier.semantics { contentDescription = "Description of the image" }
    ```

*   `role` は、ボタン、チェックボックス、画像など、UIコンポーネントの機能タイプをアクセシビリティサービスに通知します。これにより、スクリーンリーダーはインタラクションモデルを解釈し、要素を適切にアナウンスするのに役立ちます。

    ```kotlin
    Modifier.semantics { role = Role.Button }
    ```

*   `stateDescription` は、インタラクティブなUI要素の現在の状態を記述します。

    ```kotlin
    Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
    ```

*   `testTag` は、Android上のEspressoフレームワークまたはiOS上のXCUITestを使用したUIテストのために、コンポーザブル要素に一意の識別子を割り当てます。また、デバッグや、コンポーネント識別子が必要な特定の自動化シナリオでも `testTag` を使用できます。

    ```kotlin
    Modifier.testTag("my_unique_element_id")
    ```

セマンティックプロパティの全リストについては、[`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties) のJetpack Compose APIリファレンスを参照してください。

## トラバーサル順序

デフォルトでは、スクリーンリーダーはUI要素を、レイアウトに従って左から右、上から下へと固定された順序でナビゲートします。しかし、複雑なレイアウトの場合、スクリーンリーダーは正しい読み上げ順序を自動的に判断できないことがあります。これは、含まれるビューのスクロールやズームをサポートするテーブルやネストされたビューのようなコンテナビューを持つレイアウトにとって重要です。

複雑なビューをスクロールしたりスワイプしたりする際に正しい読み上げ順序を確保するには、トラバーサルセマンティックプロパティを定義します。これにより、上スワイプまたは下スワイプのアクセシビリティジェスチャーによる異なるトラバーサルグループ間の正しいナビゲーションも保証されます。

コンポーネントのトラバーサルインデックスのデフォルト値は `0f` です。
コンポーネントのトラバーサルインデックス値が低いほど、他のコンポーネントと比較してそのコンテンツ記述が早く読み上げられます。

例えば、スクリーンリーダーにフローティングアクションボタンを優先させたい場合、そのトラバーサルインデックスを `-1f` に設定できます。

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // Sets a negative index to prioritize over elements with the default index
            traversalIndex = -1f
        }
    ) {
        FloatingActionButton(onClick = {}) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Icon of floating action button"
            )
        }
    }
}
```

## 次のステップ

iOS向けアクセシビリティ機能の詳細:

*   [ハイコントラストテーマ](compose-ios-accessibility.md#high-contrast-theme)
*   [XCTestフレームワークでアクセシビリティをテスト](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
*   [トラックパッドとキーボードによる制御](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
*   [セマンティックツリーをiOSアクセシビリティツリーと同期する](compose-ios-accessibility.md#choose-the-tree-synchronization-option) (Compose Multiplatform 1.7.3以前の場合)

デスクトップ向けアクセシビリティ機能の詳細:

*   [Windowsでアクセシビリティを有効にする](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
*   [macOSおよびWindowsツールでアプリをテストする](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

実装の詳細については、[Jetpack Composeドキュメント](https://developer.android.com/develop/ui/compose/accessibility) を参照してください。
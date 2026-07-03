import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

interface RenderedTree {
    container: HTMLDivElement;
    root: Root;
}

const renderedTrees: RenderedTree[] = [];

export async function renderWithAct(children: ReactNode): Promise<HTMLDivElement> {
    const container = document.createElement("div");
    document.body.append(container);

    const root = createRoot(container);

    await act(async () => {
        root.render(children);
    });

    renderedTrees.push({ container, root });

    return container;
}

export async function cleanupRenderedTrees() {
    for (const { container, root } of renderedTrees.toReversed()) {
        await act(async () => {
            root.unmount();
        });

        container.remove();
    }

    renderedTrees.length = 0;
}

export async function clickElement(element: Element) {
    await act(async () => {
        element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
}

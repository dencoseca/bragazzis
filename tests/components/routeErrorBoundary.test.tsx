/** @vitest-environment happy-dom */

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lazy, Suspense } from "react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

afterEach(() => vi.restoreAllMocks());

test("keeps loading UI until an import rejects, then focuses recovery and reloads only on request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    let rejectImport!: (reason: Error) => void;
    const FailedPage = lazy(
        () =>
            new Promise<never>((_, reject) => {
                rejectImport = reject;
            }),
    );
    render(
        <MemoryRouter>
            <Suspense fallback={<p>Loading page</p>}>
                <RouteErrorBoundary>
                    <FailedPage />
                </RouteErrorBoundary>
            </Suspense>
        </MemoryRouter>,
    );
    expect(screen.getByText("Loading page")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reload page" })).toBeNull();
    await act(async () => rejectImport(new Error("Module download failed")));
    expect(await screen.findByRole("heading", { name: "Oops" })).toBeTruthy();
    expect(screen.queryByText("Loading page")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("main")));
    expect(reload).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Reload page" }));
    expect(reload).toHaveBeenCalledTimes(1);
});

test("clears the standalone failure when navigating home", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function FailedPage(): never {
        throw new Error("Page failed");
    }
    render(
        <MemoryRouter initialEntries={["/broken"]}>
            <RouteErrorBoundary>
                <Routes>
                    <Route path="/broken" element={<FailedPage />} />
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Home page</h1>
                                <Link to="/broken">Broken page</Link>
                            </>
                        }
                    />
                </Routes>
            </RouteErrorBoundary>
        </MemoryRouter>,
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Bragazzi's" }));
    expect(screen.getByRole("heading", { name: "Home page" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reload page" })).toBeNull();
    await user.click(screen.getByRole("link", { name: "Broken page" }));
    expect(screen.getByRole("button", { name: "Reload page" })).toBeTruthy();
});
